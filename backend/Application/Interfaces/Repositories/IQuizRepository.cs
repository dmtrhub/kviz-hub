using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Interfaces.Repositories;

public interface IQuizRepository : IGenericRepository<Quiz>
{
    Task<Quiz?> GetQuizWithQuestionsAsync(int id);
}