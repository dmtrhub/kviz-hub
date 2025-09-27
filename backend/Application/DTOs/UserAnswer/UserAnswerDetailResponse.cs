namespace KvizHub.Application.DTOs.UserAnswer;

public record UserAnswerDetailResponse(
    int AnswerOptionId,
    string Text,
    bool IsCorrect
);