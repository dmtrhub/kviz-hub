using KvizHub.Application.DTOs.Quiz;

namespace KvizHub.Application.Interfaces;

public interface IQuizService
{
    Task<IEnumerable<QuizResponse>> GetQuizzesAsync(QuizFilterRequest? filter = null);

    Task<QuizResponse?> GetQuizByIdAsync(int id);

    Task<QuizResponse> CreateQuizAsync(CreateQuizRequest request);

    Task<QuizResponse?> UpdateQuizAsync(int id, UpdateQuizRequest request);

    Task<bool> DeleteQuizAsync(int id);
}