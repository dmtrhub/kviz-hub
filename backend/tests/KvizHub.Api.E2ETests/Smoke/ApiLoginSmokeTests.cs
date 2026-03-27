using System.Net;
using System.Net.Http.Json;

namespace KvizHub.Api.E2ETests.Smoke;

public class ApiLoginSmokeTests
{
    [Fact]
    public async Task LoginEndpoint_WhenApiIsRunning_ReturnsHandledStatusCode()
    {
        var baseUrl = Environment.GetEnvironmentVariable("KVIZHUB_E2E_BASE_URL");
        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            return;
        }

        using var client = new HttpClient { BaseAddress = new Uri(baseUrl) };

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Identifier = "e2e_user",
            Password = "wrong-password"
        });

        Assert.Contains(response.StatusCode, new[]
        {
            HttpStatusCode.Unauthorized,
            HttpStatusCode.BadRequest
        });
    }
}
