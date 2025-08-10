using KvizHub.Domain.Quizzes;
using KvizHub.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace KvizHub.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<AnswerOption> AnswerOptions { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<QuizCategory> QuizCategories { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }
    public DbSet<UserAnswer> UserAnswers { get; set; }
    public DbSet<UserAnswerDetail> UserAnswerDetails { get; set; }
    public DbSet<LeaderboardEntry> LeaderboardEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        ConfigureIdentityTables(builder);
    }

    private static void ConfigureIdentityTables(ModelBuilder builder)
    {
        builder.Entity<User>(entity =>
            entity.ToTable("Users")
        );

        builder.Entity<IdentityRole<Guid>>(entity =>
            entity.ToTable("Roles")
        );

        builder.Entity<IdentityUserRole<Guid>>(entity =>
            entity.ToTable("UserRoles")
        );
    }
}
