using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace KvizHub.Api.IntegrationTests.TestInfrastructure;

public class KvizHubApiFactory : WebApplicationFactory<KvizHub.Api.Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:KvizHub", "Server=localhost;Database=KvizHub_Test;Trusted_Connection=True;");
        builder.UseSetting("Jwt:Key", "integration-tests-secret-key-that-is-long-enough");
        builder.UseSetting("Jwt:Issuer", "https://issuer.test");
        builder.UseSetting("Jwt:Audience", "https://audience.test");
        builder.UseSetting("CorsSettings:AllowedOrigins:0", "http://localhost:5173");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:KvizHub"] = "Server=localhost;Database=KvizHub_Test;Trusted_Connection=True;",
                ["Jwt:Key"] = "integration-tests-secret-key-that-is-long-enough",
                ["Jwt:Issuer"] = "https://issuer.test",
                ["Jwt:Audience"] = "https://audience.test",
                ["CorsSettings:AllowedOrigins:0"] = "http://localhost:5173"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IAuthService>();
            services.AddScoped<IAuthService, FakeAuthService>();
        });
    }
}
