using KvizHub.Application.DTOs.LeaderboardEntry;

namespace KvizHub.Application.Interfaces;

public interface ILeaderboardService
{
    Task<IEnumerable<LeaderboardEntryResponse>> GetQuizLeaderboardAsync(int quizId, int top = 10);

    Task<IEnumerable<LeaderboardEntryResponse>> GetGlobalLeaderboardAsync(int? quizId = null, DateTime? from = null, DateTime? to = null, int top = 10);
}