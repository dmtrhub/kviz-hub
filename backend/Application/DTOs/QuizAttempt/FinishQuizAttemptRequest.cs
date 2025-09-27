using KvizHub.Application.DTOs.UserAnswer;

namespace KvizHub.Application.DTOs.QuizAttempt;

public record FinishQuizAttemptRequest(
    IEnumerable<UserAnswerRequest> Answers
);