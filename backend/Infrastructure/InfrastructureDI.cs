using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Infrastructure.Data;
using KvizHub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace KvizHub.Infrastructure;

public static class InfrastructureDI
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("KvizHub")));

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IQuizRepository, QuizRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}