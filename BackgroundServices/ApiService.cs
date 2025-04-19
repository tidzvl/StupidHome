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

    public async Task FetchAndSendDataAsync()
    {
        //for sensor
        //that need input house id, and from house id -> get all room id -> that be done
        // var response = await _httpClient.GetStringAsync(_api + "/sensorData/1");
        var response = "";
        for (int i = 1; i <= 3; i++)
        {
            var response2 = await _httpClient.GetStringAsync(_api + "/sensorData/" + i);
            response = response + response2;
        }
        // response = response.Substring(1, response.Length - 2);
        response = response.Replace("}][{", "},{");
        var jsonArray = JArray.Parse(response);
        var result = jsonArray
            .GroupBy(x => x["name"].ToString())
            .Select(group => new JObject
            {
                ["name"] = group.Key,
                ["average_value"] = group.Average(x => (int)x["value"])
            });

        var finalJson = JArray.FromObject(result).ToString(Formatting.Indented);



        // if (_previousData != response)
        // {
        //     _previousData = response;
        //     await _hubContext.Clients.All.SendAsync("ReceiveData", response);
        // }
        await _hubContext.Clients.All.SendAsync("ReceiveData", finalJson);
    }
}
