using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

public class StupidHomeHub : Hub
{
    public static int ActiveConnections = 0;
    public static string? CurrentUrl { get; private set; }
    public static string? User {get; private set;}

    public override async Task OnConnectedAsync()
    {
        Interlocked.Increment(ref ActiveConnections);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        Interlocked.Decrement(ref ActiveConnections);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SetCurrentUrl(string url, string user)
    {
        CurrentUrl = url;
        User = user;
        await Task.CompletedTask;
    }


    public async Task SendUpdate(string data, string data2)
    {
        await Clients.All.SendAsync("ReceiveData", data, data2);
    }

}
