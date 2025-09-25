namespace KvizHub.Api.Extensions;

public static class CorsExtensions
{
    private const string KvizHubUI = "My_Kviz_Hub_UI_Origin";

    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var corsSettings = configuration.GetSection("CorsSettings");
        var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>();

        // Fallback na default ako nije konfigurisano
        allowedOrigins ??= ["http://localhost:5173"];

        services.AddCors(options =>
        {
            options.AddPolicy(name: KvizHubUI,
                policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        return services;
    }

    public static IApplicationBuilder UseCorsConfiguration(this IApplicationBuilder app)
    {
        app.UseCors(KvizHubUI);
        return app;
    }
}