using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static async Task<IApplicationBuilder> MigrateAndSeedDatabaseAsync(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILoggerFactory>()
            .CreateLogger("DatabaseBootstrap");

        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();

            // Migracija
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migrated successfully");

            logger.LogInformation("Running seed checks");
            var seeder = services.GetRequiredService<DataSeeder>();
            await seeder.SeedAsync();
            logger.LogInformation("Seed checks completed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database setup failed");
        }

        return app;
    }
}