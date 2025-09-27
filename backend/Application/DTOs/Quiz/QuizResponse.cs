using KvizHub.Application.DTOs.Category;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record QuizResponse(
    int Id,
    string Title,
    string Description,
    Difficulty Difficulty,
    int TimeLimit,
    int QuestionCount,
    IEnumerable<CategoryResponse> Categories
);