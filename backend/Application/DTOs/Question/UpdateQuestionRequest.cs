using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Question;

public record UpdateQuestionRequest(
    string Text,
    QuestionType Type,
    int Points,
    IEnumerable<UpdateAnswerOptionRequest> AnswerOptions
);