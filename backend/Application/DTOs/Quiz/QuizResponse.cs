using KvizHub.Application.DTOs.Category;
using KvizHub.Application.DTOs.Question;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record QuizResponse(
    int Id,
    string Title,
    string Description,
    string Difficulty,
    int TimeLimit,
    int QuestionCount,
    IEnumerable<CategoryResponse> Categories,
    IEnumerable<QuestionResponse> Questions
);