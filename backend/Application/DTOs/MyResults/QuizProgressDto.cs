namespace KvizHub.Application.DTOs.MyResults;

public record QuizProgressDto(
    int QuizId,
    string QuizTitle,
    List<QuizAttemptProgressDto> Attempts,
    int BestScore,
    int AverageScore,
    int Improvement
);