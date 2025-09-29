using FluentValidation.AspNetCore;
using KvizHub.Api.Extensions;
using KvizHub.Api.Middleware;
using KvizHub.Application;
using KvizHub.Infrastructure;
using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();

builder.Services
    .AddSwaggerDocumentation()
    .AddInfrastructure(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddApplication(builder.Configuration)
    .AddCorsConfiguration(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();
        Console.WriteLine("✅ Database migrated successfully!");

        if (!await context.Users.AnyAsync())
        {
            Console.WriteLine("🌱 Seeding database...");

            var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
            await seeder.SeedAsync();

            Console.WriteLine("✅ Database seeded successfully!");
        }
        else
        {
            Console.WriteLine("✅ Database already has data. Skipping seed.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Database setup failed: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCorsConfiguration();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlerMiddleware>();

app.MapControllers();

app.Run();