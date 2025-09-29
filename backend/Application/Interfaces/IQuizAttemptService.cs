using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;

namespace KvizHub.Application.Interfaces;

public interface IQuizAttemptService
{
    Task<QuizAttemptResponse> CreateAttemptAsync(int quizId, Guid userId);

    Task<QuizAttemptResponse?> FinishAttemptAsync(int attemptId, FinishQuizAttemptRequest request, Guid userId);

    Task<IEnumerable<QuizAttemptResponse>> GetUserAttemptsAsync(Guid userId);

    Task<QuizAttemptResponse?> GetAttemptByIdAsync(int attemptId, Guid userId);

    Task<QuizAttemptResponse?> GetActiveAttemptAsync(int quizId, Guid userId);

    Task<List<MyQuizResultDto>> GetUserResultsAsync(Guid userId);

    Task<List<QuizProgressDto>> GetUserProgressAsync(Guid userId);

    Task<IEnumerable<QuizAttemptResponse>> GetAllQuizAttemptsAsync();

    Task<IEnumerable<QuizAttemptResponse>> GetQuizAttemptsByQuizAsync(int quizId);
}