namespace KvizHub.Application.DTOs.UserAnswer;

public record UserAnswerDetailResponse(
    string Text,
    bool IsCorrect
);