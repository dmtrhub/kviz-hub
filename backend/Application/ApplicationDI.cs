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
        AddServices(services);

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }

    private static void AddServices(IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IQuizService, QuizService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IQuestionService, QuestionService>();
        services.AddScoped<IQuizAttemptService, QuizAttemptService>();
        services.AddScoped<ILeaderboardService, LeaderboardService>();
    }
}