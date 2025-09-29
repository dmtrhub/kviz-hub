using KvizHub.Application.DTOs.LeaderboardEntry;

namespace KvizHub.Application.Interfaces;

public interface ILeaderboardService
{
    Task<LeaderboardResponse> GetLeaderboardAsync(LeaderboardFilter filter);

    Task<LeaderboardResponse> GetUserRankAsync(Guid userId, LeaderboardFilter filter);
}