using KvizHub.Application.DTOs.AnswerOption;

namespace KvizHub.Application.DTOs.Question;

public record UpdateQuestionRequest(
    int QuizId,
    string Text,
    string Type,
    int Points,
    IEnumerable<UpdateAnswerOptionRequest> AnswerOptions
);