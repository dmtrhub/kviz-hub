namespace KvizHub.Application.DTOs.AnswerOption;

public record AnswerOptionResponse(
    int Id,
    string Text,
    bool IsCorrect,
    int QuestionId
);