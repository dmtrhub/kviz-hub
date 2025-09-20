using FluentValidation;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace KvizHub.Application;

public static class ApplicationDI
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}