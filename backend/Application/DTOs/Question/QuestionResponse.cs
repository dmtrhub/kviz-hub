using KvizHub.Application.DTOs.AnswerOption;

namespace KvizHub.Application.DTOs.Question;

public record QuestionResponse(
    int Id,
    string Text,
    string Type,
    int Points,
    int QuizId,
    IEnumerable<AnswerOptionResponse> AnswerOptions
);