using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using KvizHub.Api.IntegrationTests.TestInfrastructure;

namespace KvizHub.Api.IntegrationTests.Controllers;

public class AuthControllerIntegrationTests : IClassFixture<KvizHubApiFactory>
{
    private readonly KvizHubApiFactory _factory;

    public AuthControllerIntegrationTests(KvizHubApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsSuccessResponse()
    {
        using var client = _factory.CreateClient();
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Identifier = "valid_user",
            Password = "Password123!"
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var loginJson = await loginResponse.Content.ReadAsStringAsync();
        using var loginDoc = JsonDocument.Parse(loginJson);
        var loginToken = loginDoc.RootElement.GetProperty("token").GetString();

        Assert.False(string.IsNullOrWhiteSpace(loginToken));
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        using var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Identifier = "missing-user",
            Password = "bad-password"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
