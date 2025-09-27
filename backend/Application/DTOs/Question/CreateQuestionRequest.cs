using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Question;

public record CreateQuestionRequest(
    string Text,
    QuestionType Type,
    int Points,
    IEnumerable<CreateAnswerOptionRequest> AnswerOptions
);