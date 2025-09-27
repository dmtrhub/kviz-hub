using FluentValidation.AspNetCore;
using KvizHub.Api.Extensions;
using KvizHub.Api.Middleware;
using KvizHub.Application;
using KvizHub.Infrastructure;
using KvizHub.Infrastructure.Data;

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
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var seeder = new DataSeeder(dbContext);
    await seeder.SeedAsync();
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