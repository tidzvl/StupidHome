using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

public class StupidHomeHub : Hub
{
    public static int ActiveConnections = 0;

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

    public async Task SendUpdate(string data)
    {
        await Clients.All.SendAsync("ReceiveData", data);
    }
}
