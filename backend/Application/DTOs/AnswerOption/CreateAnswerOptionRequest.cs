namespace KvizHub.Application.DTOs.AnswerOption;

public record CreateAnswerOptionRequest(
    string Text,
    bool IsCorrect,
    int QuestionId
);