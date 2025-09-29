namespace KvizHub.Application.DTOs.LeaderboardEntry;

public record LeaderboardFilter
{
    public int? QuizId { get; set; }
    public string TimePeriod { get; set; } = "all"; // "all", "weekly", "monthly"
    public int? Top { get; set; } = 50;
}