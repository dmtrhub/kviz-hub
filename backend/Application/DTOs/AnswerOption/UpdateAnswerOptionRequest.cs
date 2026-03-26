namespace KvizHub.Application.DTOs.AnswerOption;

public record UpdateAnswerOptionRequest(
    int? Id,
    string Text,
    bool IsCorrect
);