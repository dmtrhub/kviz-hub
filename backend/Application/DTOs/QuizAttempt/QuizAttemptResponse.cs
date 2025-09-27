using KvizHub.Application.DTOs.UserAnswer;

namespace KvizHub.Application.DTOs.QuizAttempt;

public record QuizAttemptResponse(
    int Id = 0,
    int QuizId = 0,
    Guid UserId = default,
    int Score = 0,
    DateTime StartedAt = default,
    DateTime? FinishedAt = null,
    IEnumerable<UserAnswerResponse> Answers = null!
);