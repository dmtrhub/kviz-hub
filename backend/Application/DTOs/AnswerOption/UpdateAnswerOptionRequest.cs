namespace KvizHub.Application.DTOs.AnswerOption;

public record UpdateAnswerOptionRequest(
    string Text,
    bool IsCorrect
);