namespace KvizHub.Application.DTOs.LeaderboardEntry;

public class LeaderboardEntryResponse
{
    public int Id { get; set; }
    public string Username { get; set; } = default!;
    public string QuizTitle { get; set; } = default!;
    public int Score { get; set; }
    public DateTime AchievedAt { get; set; }
    public int Rank { get; set; }
}