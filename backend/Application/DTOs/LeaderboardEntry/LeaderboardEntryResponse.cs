namespace KvizHub.Application.DTOs.LeaderboardEntry;

public record LeaderboardEntryResponse
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public int QuizId { get; set; }
    public string QuizTitle { get; set; } = string.Empty;
    public int Score { get; set; }
    public int MaxScore { get; set; }
    public int Percentage { get; set; }
    public DateTime AchievedAt { get; set; }
    public int Position { get; set; }
    public int Duration { get; set; } // in minutes
}