using Microsoft.AspNetCore.SignalR;

public class StupidHomeHub : Hub
{
    public async Task SendUpdate(string data)
    {
        await Clients.All.SendAsync("ReceiveData", data);
    }
}
