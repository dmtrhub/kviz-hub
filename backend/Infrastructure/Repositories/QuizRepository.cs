using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Repositories;

public class QuizRepository : GenericRepository<Quiz>, IQuizRepository
{
    public QuizRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Quiz?> GetQuizWithQuestionsAsync(int id)
    {
        return await _dbSet
            .Include(q => q.Questions)
            .Include(q => q.QuizCategories)
            .FirstOrDefaultAsync(q => q.Id == id);
    }
}