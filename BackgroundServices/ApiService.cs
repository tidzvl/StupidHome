using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly IHubContext<StupidHomeHub> _hubContext;
    private string _api = "http://127.0.0.1:8000/api/v1";
    // private string _previousData;

    public ApiService(HttpClient httpClient, IHubContext<StupidHomeHub> hubContext)
    {
        _httpClient = httpClient;
        _hubContext = hubContext;
    }

    public async Task FetchAndSendDataAsync(string c_url)
    {
        if (c_url.ToLower() == "/home"){
          var sensorTasks = new List<Task<string>>();
          for (int i = 1; i <= 3; i++)
          {
              sensorTasks.Add(_httpClient.GetStringAsync($"{_api}/getRoomSensorData/{i}"));
          }

          var deviceTask = _httpClient.GetStringAsync($"{_api}/getNumberOfDevices/1");

          var allResponses = await Task.WhenAll(sensorTasks);
          var deviceResponse = await deviceTask;

          var mergedResponses = "[" + string.Join(",", allResponses) + "]";
          var outerArray = JArray.Parse(mergedResponses);
          var sensorData = outerArray.SelectMany(innerToken => innerToken)
                                   .OfType<JObject>()
                                   .ToList();
          var sensorResult = sensorData
              .GroupBy(x => x["name"]?.ToString() ?? "Unknown")
              .Select(group =>
              {
                  var validValues = group
                      .Where(x => x["value"] != null && int.TryParse(x["value"].ToString(), out _))
                      .Select(x => int.Parse(x["value"].ToString()));

                  double averageValue = validValues.Any() ? validValues.Average() : 0;
                  return new JObject
                  {
                      ["name"] = group.Key,
                      ["average_value"] = averageValue
                  };
              });

          var finalJsonArray = new JArray(sensorResult);

          var deviceJson = JObject.Parse(deviceResponse);
          finalJsonArray.Add(deviceJson);

          var finalJson = finalJsonArray.ToString(Formatting.Indented);

          await _hubContext.Clients.All.SendAsync("ReceiveData", finalJson);
        }else if(c_url.ToLower() == "/home/analytics") {
          var sensorTasks = new List<Task<string>>();
          for (int i = 1; i <= 3; i++)
          {
              sensorTasks.Add(_httpClient.GetStringAsync($"{_api}/getRoomSensorData/{i}"));
          }
          var allResponses = await Task.WhenAll(sensorTasks);
          await _hubContext.Clients.All.SendAsync("ReceiveData", allResponses);
        }
    }

}
