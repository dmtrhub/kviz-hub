using KvizHub.Domain.Enums;

namespace KvizHub.Application.DTOs.Quiz;

public record CreateQuizRequest(
    string Title,
    string Description,
    Difficulty Difficulty,
    int TimeLimit,
    IEnumerable<int> CategoryIds
);