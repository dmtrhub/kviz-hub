using AutoMapper;
using AutoMapper.QueryableExtensions;
using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public sealed class LeaderboardService(IUnitOfWork unitOfWork, IMapper mapper) : ILeaderboardService
{
    private const int DefaultTop = 50;
    private const int MaxTop = 200;

    public async Task<LeaderboardResponse> GetLeaderboardAsync(LeaderboardFilter filter)
    {
        filter ??= new LeaderboardFilter();

        var query = ApplyFilters(unitOfWork.LeaderboardEntries.Query().AsNoTracking(), filter)
            .OrderByDescending(e => e.Score)
            .ThenBy(e => e.Duration)
            .ThenBy(e => e.AchievedAt);

        var topLimit = Math.Clamp(filter.Top ?? DefaultTop, 1, MaxTop);

        var entries = await query
            .Take(topLimit)
            .ProjectTo<LeaderboardEntryResponse>(mapper.ConfigurationProvider)
            .ToListAsync();

        for (int i = 0; i < entries.Count; i++)
        {
            entries[i].Position = i + 1;
        }

        return new LeaderboardResponse
        {
            Entries = entries,
            TotalCount = entries.Count
        };
    }

    public async Task<LeaderboardResponse> GetUserRankAsync(Guid userId, LeaderboardFilter filter)
    {
        filter ??= new LeaderboardFilter();

        var filtered = ApplyFilters(unitOfWork.LeaderboardEntries.Query().AsNoTracking(), filter);

        var candidate = await filtered
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Score)
            .ThenBy(e => e.Duration)
            .ThenBy(e => e.AchievedAt)
            .ProjectTo<LeaderboardEntryResponse>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (candidate == null)
        {
            return new LeaderboardResponse
            {
                Entries = [],
                TotalCount = 0
            };
        }

        var rankAheadCount = await filtered.CountAsync(e =>
            e.Score > candidate.Score ||
            (e.Score == candidate.Score && e.Duration < candidate.Duration) ||
            (e.Score == candidate.Score && e.Duration == candidate.Duration && e.AchievedAt < candidate.AchievedAt));

        candidate.Position = rankAheadCount + 1;

        return new LeaderboardResponse
        {
            Entries = [candidate],
            TotalCount = 1
        };
    }

    private static IQueryable<Domain.Entities.Quizzes.LeaderboardEntry> ApplyFilters(
        IQueryable<Domain.Entities.Quizzes.LeaderboardEntry> query,
        LeaderboardFilter filter)
    {
        if (filter.QuizId > 0)
        {
            query = query.Where(e => e.QuizId == filter.QuizId);
        }

        var period = string.IsNullOrWhiteSpace(filter.TimePeriod)
            ? "all"
            : filter.TimePeriod.Trim().ToLowerInvariant();

        if (period is not "all")
        {
            var now = DateTime.UtcNow;
            var cutoff = period switch
            {
                "weekly" => now.AddDays(-7),
                "monthly" => now.AddDays(-30),
                _ => now.AddYears(-100)
            };

            query = query.Where(e => e.AchievedAt >= cutoff);
        }

        return query;
    }
}