using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace KvizHub.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _currentTransaction;

    public IQuizRepository Quizzes { get; }
    public IGenericRepository<Category> Categories { get; }
    public IUserRepository Users { get; }
    public IGenericRepository<Question> Questions { get; }
    public IGenericRepository<QuizAttempt> QuizAttempts { get; }
    public IGenericRepository<UserAnswer> UserAnswers { get; }
    public IGenericRepository<LeaderboardEntry> LeaderboardEntries { get; }
    public IGenericRepository<QuizCategory> QuizCategories { get; }
    public IGenericRepository<UserAnswerDetail> UserAnswerDetails { get; }
    public IGenericRepository<AnswerOption> AnswerOptions { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;

        Quizzes = new QuizRepository(_context);
        Categories = new GenericRepository<Category>(_context);
        Users = new UserRepository(_context);
        Questions = new GenericRepository<Question>(_context);
        QuizAttempts = new GenericRepository<QuizAttempt>(_context);
        UserAnswers = new GenericRepository<UserAnswer>(_context);
        LeaderboardEntries = new GenericRepository<LeaderboardEntry>(_context);
        QuizCategories = new GenericRepository<QuizCategory>(_context);
        UserAnswerDetails = new GenericRepository<UserAnswerDetail>(_context);
        AnswerOptions = new GenericRepository<AnswerOption>(_context);
    }

    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_currentTransaction == null)
        {
            return;
        }

        await _currentTransaction.CommitAsync();
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    public async Task RollbackTransactionAsync()
    {
        if (_currentTransaction == null)
        {
            return;
        }

        await _currentTransaction.RollbackAsync();
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose()
    {
        _currentTransaction?.Dispose();
        _context.Dispose();
    }
}