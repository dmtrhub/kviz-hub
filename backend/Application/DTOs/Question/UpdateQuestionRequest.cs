using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Question;

public record UpdateQuestionRequest(
    string Text,
    string Type,
    int Points,
    IEnumerable<UpdateAnswerOptionRequest> AnswerOptions
);