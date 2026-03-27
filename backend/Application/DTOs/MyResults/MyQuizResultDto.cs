namespace KvizHub.Application.DTOs.MyResults;

public record MyQuizResultDto
{
    public int AttemptId { get; init; }
    public int QuizId { get; init; }
    public string QuizTitle { get; init; } = string.Empty;
    public int Score { get; init; }
    public int MaxScore { get; init; }
    public int Percentage { get; init; }
    public int CorrectAnswers { get; init; }
    public int TotalQuestions { get; init; }
    public DateTime StartedAt { get; init; }
    public DateTime FinishedAt { get; init; }
    public int Duration { get; init; } // minutes
}