using KvizHub.Application.DTOs.AnswerOption;

namespace KvizHub.Application.DTOs.Question;

public record CreateQuestionRequest(
    string Text,
    string Type,
    int Points,
    IEnumerable<CreateAnswerOptionRequest> AnswerOptions
);