using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Infrastructure.Data;
using KvizHub.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IQuizRepository Quizzes { get; }
    public ICategoryRepository Categories { get; }
    public IUserRepository Users { get; }
    public IGenericRepository<Question> Questions { get; }
    public IGenericRepository<QuizAttempt> QuizAttempts { get; }
    public IGenericRepository<UserAnswer> UserAnswers { get; }
    public IGenericRepository<LeaderboardEntry> LeaderboardEntries { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;

        Quizzes = new QuizRepository(_context);
        Categories = new CategoryRepository(_context);
        Users = new UserRepository(_context);
        Questions = new GenericRepository<Question>(_context);
        QuizAttempts = new GenericRepository<QuizAttempt>(_context);
        UserAnswers = new GenericRepository<UserAnswer>(_context);
        LeaderboardEntries = new GenericRepository<LeaderboardEntry>(_context);
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}