using KvizHub.Application.DTOs.Question;

namespace KvizHub.Application.Interfaces;

public interface IQuestionService
{
    Task<IEnumerable<QuestionResponse>> GetQuestionsAsync();

    Task<IEnumerable<QuestionResponse>> GetByQuizIdAsync(int quizId);

    Task<QuestionResponse?> GetByIdAsync(int id);

    Task<QuestionResponse> CreateQuestionAsync(int quizId, CreateQuestionRequest request);

    Task<QuestionResponse?> UpdateQuestionAsync(int id, UpdateQuestionRequest request);

    Task<bool> DeleteQuestionAsync(int id);
}