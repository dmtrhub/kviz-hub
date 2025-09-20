using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Entities.Users;
using KvizHub.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IQuizRepository Quizzes { get; }
    public IGenericRepository<User> Users { get; }
    public IGenericRepository<QuizAttempt> QuizAttempts { get; }
    public IGenericRepository<UserAnswer> UserAnswers { get; }
    public IGenericRepository<LeaderboardEntry> LeaderboardEntries { get; }

    public UnitOfWork(ApplicationDbContext context, IQuizRepository quizRepository)
    {
        _context = context;

        Quizzes = quizRepository;
        Users = new GenericRepository<User>(_context);
        QuizAttempts = new GenericRepository<QuizAttempt>(_context);
        UserAnswers = new GenericRepository<UserAnswer>(_context);
        LeaderboardEntries = new GenericRepository<LeaderboardEntry>(_context);
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}