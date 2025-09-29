namespace KvizHub.Application.DTOs.MyResults;

public record MyQuizResultDto(
    int AttemptId,
    int QuizId,
    string QuizTitle,
    int Score,
    int MaxScore,
    int Percentage,
    int CorrectAnswers,
    int TotalQuestions,
    DateTime StartedAt,
    DateTime FinishedAt,
    int Duration // minutes
);