using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IQuizRepository Quizzes { get; }
    IGenericRepository<Category> Categories { get; }
    IUserRepository Users { get; }
    IGenericRepository<Question> Questions { get; }
    IGenericRepository<QuizAttempt> QuizAttempts { get; }
    IGenericRepository<UserAnswer> UserAnswers { get; }
    IGenericRepository<LeaderboardEntry> LeaderboardEntries { get; }
    IGenericRepository<QuizCategory> QuizCategories { get; }
    IGenericRepository<UserAnswerDetail> UserAnswerDetails { get; }
    IGenericRepository<AnswerOption> AnswerOptions { get; }

    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task<int> SaveChangesAsync();
}