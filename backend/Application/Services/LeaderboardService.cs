using AutoMapper;
using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public class LeaderboardService : ILeaderboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LeaderboardService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<LeaderboardResponse> GetLeaderboardAsync(LeaderboardFilter filter)
    {
        var query = _unitOfWork.LeaderboardEntries.Query()
            .Include(le => le.Quiz)
            .ThenInclude(q => q.Questions)
            .Include(le => le.User)
            .OrderByDescending(le => le.Score)
            .ThenBy(le => le.Duration)
            .AsQueryable();

        if (filter.QuizId.HasValue && filter.QuizId.Value > 0)
            query = query.Where(e => e.QuizId == filter.QuizId.Value);

        if (filter.TimePeriod != "all")
        {
            var now = DateTime.UtcNow;
            var startDate = filter.TimePeriod switch
            {
                "weekly" => now.AddDays(-7),
                "monthly" => now.AddDays(-30),
                _ => now.AddYears(-100) // all time
            };
            query = query.Where(e => e.AchievedAt >= startDate);
        }

        var entries = await query
            .OrderByDescending(e => e.Score)
            .ThenBy(e => e.AchievedAt)
            .Take(filter.Top ?? 50)
            .ToListAsync();

        var responseEntries = _mapper.Map<List<LeaderboardEntryResponse>>(entries);

        for (int i = 0; i < responseEntries.Count; i++)
        {
            responseEntries[i].Position = i + 1;

            responseEntries[i].Duration = entries[i].Duration;
        }

        return new LeaderboardResponse
        {
            Entries = responseEntries,
            TotalCount = responseEntries.Count
        };
    }

    public async Task<LeaderboardResponse> GetUserRankAsync(Guid userId, LeaderboardFilter filter)
    {
        var leaderboardResponse = await GetLeaderboardAsync(filter);

        var userEntry = leaderboardResponse.Entries
            .FirstOrDefault(e => e.UserId == userId.ToString());

        return new LeaderboardResponse
        {
            Entries = userEntry != null ? new List<LeaderboardEntryResponse> { userEntry } : new List<LeaderboardEntryResponse>(),
            TotalCount = userEntry != null ? 1 : 0
        };
    }
}