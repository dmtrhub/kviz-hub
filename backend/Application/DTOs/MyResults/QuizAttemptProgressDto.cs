namespace KvizHub.Application.DTOs.MyResults;

public record QuizAttemptProgressDto(
    int AttemptId,
    int Score,
    int Percentage,
    DateTime Date,
    int Duration
);