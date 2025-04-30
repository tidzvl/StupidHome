using System.Net.Http;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly IHubContext<StupidHomeHub> _hubContext;
    private string _api = "http://127.0.0.1:8000/api/v1";
    // private string _previousData;
    // private JObject _cachedUserJson;
    // private string _cachedHouseId;
    // private string _cachedAllDevice;

    public ApiService(HttpClient httpClient, IHubContext<StupidHomeHub> hubContext)
    {
        _httpClient = httpClient;
        _hubContext = hubContext;
    }

    public async Task FetchAndSendDataAsync(string c_url, string user)
    {
        if(user == null || c_url == null) return;
        byte[] u_db = Convert.FromBase64String(user);
        string u = Encoding.UTF8.GetString(u_db);
        JObject userJson = JObject.Parse(u);
        var house_id = userJson["admin_house"]?.ToString();
        if (!string.IsNullOrEmpty(house_id))
        {
            var houseArray = JArray.Parse(house_id);
            house_id = houseArray.FirstOrDefault()?.ToString();
        }
        var allDevice = await _httpClient.GetStringAsync($"{_api}/getAllDevices/{house_id}");
        if (allDevice == "") return;
        var allDeviceJson = JArray.Parse(allDevice);
        if (allDeviceJson == null) return;
        foreach (var room in allDeviceJson)
        {
            var sensorTasks = allDeviceJson.Select(async room =>
            {
                var roomId = room["room_id"]?.ToString();
                if (!string.IsNullOrEmpty(roomId))
                {
                    try
                    {
                        var roomSensorData = await _httpClient.GetStringAsync($"{_api}/getRoomSensorData/{roomId}");
                        if (!string.IsNullOrEmpty(roomSensorData))
                        {
                            var sensorDataJson = JArray.Parse(roomSensorData);
                            room["sensors"] = sensorDataJson;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error fetching sensor data for room {roomId}: {ex.Message}");
                    }
                }
            });

            await Task.WhenAll(sensorTasks);
        }
        var finalJson2 = allDeviceJson.ToString(Formatting.Indented);

        if (c_url.ToLower() == "/home"){
          var roomIds = allDeviceJson.Select(room => room["room_id"]?.ToString())
                               .Where(roomId => !string.IsNullOrEmpty(roomId))
                               .ToList();

          var sensorTasks = roomIds.Select(async roomId =>
          {
              try
              {
                  var roomSensorData = await _httpClient.GetStringAsync($"{_api}/getRoomSensorData/{roomId}");
                  return JArray.Parse(roomSensorData);
              }
              catch (Exception ex)
              {
                  Console.WriteLine($"Error fetching sensor data for room {roomId}: {ex.Message}");
                  return new JArray();
              }
          });

          var allResponses = await Task.WhenAll(sensorTasks);

          var mergedResponses = new JArray(allResponses.SelectMany(response => response));

          var sensorData = mergedResponses.OfType<JObject>().ToList();
          var sensorResult = sensorData
              .GroupBy(x => x["type"]?.ToString() ?? "Unknown")
              .Select(group =>
              {
                  var validValues = group
                      .Where(x => x["value"] != null && double.TryParse(x["value"].ToString(), out _))
                      .Select(x => double.Parse(x["value"].ToString()));

                  double averageValue = validValues.Any() ? validValues.Average() : 0;

                  return new JObject
                  {
                      ["type"] = group.Key,
                      ["average_value"] = averageValue
                  };
              });

          // var finalJsonArray = new JArray(sensorResult);
          var totalDevices = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray()).Count();
          var devicesOn = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray())
                                      .Count(device => device["on_off"]?.ToObject<bool>() == true);
          var pinnedDevices = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray())
                                          .Where(device => device["pinned"]?.ToObject<bool>() == true)
                                          .Select(device => new JObject
                                          {
                                              ["device_id"] = device["device_id"],
                                              ["name"] = device["name"],
                                              ["type"] = device["type"],
                                              ["on_off"] = device["on_off"]
                                          })
                                          .ToList();

          var finalJsonArray = new JArray(sensorResult);
          var summary = new JObject
          {
              ["total_devices"] = totalDevices,
              ["devices_on"] = devicesOn,
              ["pinned_devices"] = new JArray(pinnedDevices)
          };
          finalJsonArray.Add(summary);

          var finalJson = finalJsonArray.ToString(Formatting.Indented);

          await _hubContext.Clients.All.SendAsync("ReceiveData", finalJson);
        }
        // else if(c_url.ToLower() == "/home/analytics") {
        //   var sensorTasks = new List<Task<string>>();
        //   for (int i = 1; i <= 3; i++)
        //   {
        //       sensorTasks.Add(_httpClient.GetStringAsync($"{_api}/getRoomSensorData/{i}"));
        //   }
        //   var allResponses = await Task.WhenAll(sensorTasks);
        //   string allDeviceJsonString = allDeviceJson.ToString(Formatting.Indented);
        //   await _hubContext.Clients.All.SendAsync("ReceiveData", allResponses, finalJson2);
        // }
        else if (c_url.ToLower() == "/home/analytics")
        {
            var roomIds = allDeviceJson.Select(room => room["room_id"]?.ToString())
                                      .Where(roomId => !string.IsNullOrEmpty(roomId))
                                      .ToList();

            var startTime = DateTime.UtcNow.AddMonths(-1).ToString("yyyy-MM-ddTHH:mm:ss");
            var endTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");

            var sensorTasks = roomIds.Select(async roomId =>
            {
                try
                {
                    var roomSensorData = await _httpClient.GetStringAsync($"{_api}/getRoomSensorData/{roomId}");
                    JArray sensorDataJson;

                    // Kiểm tra nếu dữ liệu trả về là một mảng JSON hợp lệ
                    if (!string.IsNullOrEmpty(roomSensorData) && roomSensorData.TrimStart().StartsWith("["))
                    {
                        sensorDataJson = JArray.Parse(roomSensorData);
                    }
                    else
                    {
                        sensorDataJson = new JArray(); // Nếu không hợp lệ, gán giá trị mặc định
                    }

                    var timeDataRequest = new
                    {
                        room_id = roomId,
                        start_time = startTime,
                        end_time = endTime
                    };

                    var timeDataResponse = await _httpClient.PostAsync(
                        $"{_api}/sensorDataTime/{roomId}",
                        new StringContent(JsonConvert.SerializeObject(timeDataRequest), Encoding.UTF8, "application/json")
                    );

                    JArray timeDataJson;

                    // Kiểm tra nếu dữ liệu trả về từ sensorDataTime là một mảng JSON hợp lệ
                    var timeDataResponseContent = await timeDataResponse.Content.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(timeDataResponseContent) && timeDataResponseContent.TrimStart().StartsWith("["))
                    {
                        timeDataJson = JArray.Parse(timeDataResponseContent);
                    }
                    else
                    {
                        timeDataJson = new JArray(); // Nếu không hợp lệ, gán giá trị mặc định
                    }

                    var mergedData = sensorDataJson.Concat(timeDataJson)
                                                  .GroupBy(sensor => sensor["type"]?.ToString() ?? "Unknown")
                                                  .Select(group =>
                                                  {
                                                      var validValues = group
                                                          .Where(x => x["value"] != null && double.TryParse(x["value"].ToString(), out _))
                                                          .Select(x => double.Parse(x["value"].ToString()));

                                                      double averageValue = validValues.Any() ? validValues.Average() : 0;

                                                      return new JObject
                                                      {
                                                          ["type"] = group.Key,
                                                          ["average_value"] = averageValue
                                                      };
                                                  });

                    return new JObject
                    {
                        ["room_id"] = roomId,
                        ["merged_data"] = new JArray(mergedData)
                    };
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error fetching data for room {roomId}: {ex.Message}");
                    return new JObject
                    {
                        ["room_id"] = roomId,
                        ["merged_data"] = new JArray()
                    };
                }
            });

            var allResponses = await Task.WhenAll(sensorTasks);

            var mergedResponses = new JArray(allResponses);

            // Tính toán giá trị trung bình của tất cả các sensor type từ mergedResponses
            var allSensorData = mergedResponses
                .SelectMany(room => room["merged_data"] ?? new JArray())
                .OfType<JObject>()
                .ToList();

            var sensorResult = allSensorData
                .GroupBy(sensor => sensor["type"]?.ToString() ?? "Unknown")
                .Select(group =>
                {
                    var validValues = group
                        .Where(sensor => sensor["average_value"] != null && double.TryParse(sensor["average_value"].ToString(), out _))
                        .Select(sensor => double.Parse(sensor["average_value"].ToString()));

                    double averageValue = validValues.Any() ? validValues.Average() : 0;

                    return new JObject
                    {
                        ["type"] = group.Key,
                        ["average_value"] = averageValue
                    };
                })
                .ToList();

            // Tính tổng số thiết bị, số thiết bị đang bật và các thiết bị được ghim
            var totalDevices = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray()).Count();
            var devicesOn = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray())
                                        .Count(device => device["on_off"]?.ToObject<bool>() == true);
            var pinnedDevices = allDeviceJson.SelectMany(room => room["devices"] ?? new JArray())
                                            .Where(device => device["pinned"]?.ToObject<bool>() == true)
                                            .Select(device => new JObject
                                            {
                                                ["device_id"] = device["device_id"],
                                                ["name"] = device["name"],
                                                ["type"] = device["type"],
                                                ["on_off"] = device["on_off"]
                                            })
                                            .ToList();

            // Tạo phần summary
            var summary = new JObject
            {
                ["total_devices"] = totalDevices,
                ["devices_on"] = devicesOn,
                ["pinned_devices"] = new JArray(pinnedDevices)
            };

            // Tạo finalJson
            var finalJsonArray = new JArray(sensorResult);
            finalJsonArray.Add(summary);

            var finalJson = finalJsonArray.ToString(Formatting.Indented);

            // Gửi dữ liệu finalJson và mergedResponses
            await _hubContext.Clients.All.SendAsync("ReceiveData", finalJson, mergedResponses.ToString(Formatting.Indented));
        }
    }

}
