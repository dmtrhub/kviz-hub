using KvizHub.Application.DTOs.Question;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record QuizDetailResponse(
    int Id,
    string Title,
    string Description,
    Difficulty Difficulty,
    int TimeLimit,
    List<QuestionResponse> Questions
);