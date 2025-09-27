using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Entities.Users;

namespace KvizHub.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IQuizRepository Quizzes { get; }
    ICategoryRepository Categories { get; }
    IUserRepository Users { get; }
    IGenericRepository<Question> Questions { get; }
    IGenericRepository<QuizAttempt> QuizAttempts { get; }
    IGenericRepository<UserAnswer> UserAnswers { get; }
    IGenericRepository<LeaderboardEntry> LeaderboardEntries { get; }

    Task<int> SaveChangesAsync();
}