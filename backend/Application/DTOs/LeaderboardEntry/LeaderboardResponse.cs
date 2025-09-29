namespace KvizHub.Application.DTOs.LeaderboardEntry;

public record LeaderboardResponse
{
    public List<LeaderboardEntryResponse> Entries { get; set; } = new();
    public int TotalCount { get; set; }
}