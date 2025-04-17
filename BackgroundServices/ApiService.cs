using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly IHubContext<StupidHomeHub> _hubContext;
    // private string _previousData;

    public ApiService(HttpClient httpClient, IHubContext<StupidHomeHub> hubContext)
    {
        _httpClient = httpClient;
        _hubContext = hubContext;
    }

    public async Task FetchAndSendDataAsync()
    {
        var response = await _httpClient.GetStringAsync("http://127.0.0.1:8000/api/v1/getNumberOfDevices/1");
        // if (_previousData != response)
        // {
        //     _previousData = response;
        //     await _hubContext.Clients.All.SendAsync("ReceiveData", response);
        // }
        await _hubContext.Clients.All.SendAsync("ReceiveData", response);
    }
}
