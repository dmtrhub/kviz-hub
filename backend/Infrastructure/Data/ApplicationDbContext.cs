using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Data;

public class ApplicationDbContext : DbContext
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
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}