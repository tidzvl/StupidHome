using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

public class RealtimeDataService : BackgroundService
{
    private readonly ApiService _apiService;

    public RealtimeDataService(ApiService apiService)
    {
        _apiService = apiService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (StupidHomeHub.ActiveConnections > 0)
            {
              var currentUrl = StupidHomeHub.CurrentUrl;
              var user = StupidHomeHub.User;
              await _apiService.FetchAndSendDataAsync(currentUrl, user);
            }

            await Task.Delay(TimeSpan.FromSeconds(50), stoppingToken);
        }
    }
}
