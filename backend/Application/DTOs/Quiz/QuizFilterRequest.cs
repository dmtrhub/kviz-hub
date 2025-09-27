using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record QuizFilterRequest(
    string? Keyword = null,
    int? CategoryId = null,
    Difficulty? Difficulty = null
);