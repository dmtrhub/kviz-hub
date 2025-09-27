using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record UpdateQuizRequest(
    string Title,
    string Description,
    Difficulty Difficulty,
    int TimeLimit,
    IEnumerable<int>? CategoryIds = null
);