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

    public async Task<IEnumerable<LeaderboardEntryResponse>> GetQuizLeaderboardAsync(int quizId, int top = 10)
    {
        var entries = await _unitOfWork.LeaderboardEntries.Query()
            .Include(e => e.User)
            .Include(e => e.Quiz)
            .Where(e => e.QuizId == quizId)
            .OrderByDescending(e => e.Score)
            .ThenBy(e => e.AchievedAt)
            .Take(top)
            .ToListAsync();

        var response = _mapper.Map<List<LeaderboardEntryResponse>>(entries);

        for (int i = 0; i < response.Count; i++)
        {
            response[i].Rank = i + 1;
        }

        return response;
    }

    public async Task<IEnumerable<LeaderboardEntryResponse>> GetGlobalLeaderboardAsync(int? quizId = null, DateTime? from = null, DateTime? to = null, int top = 10)
    {
        var query = _unitOfWork.LeaderboardEntries.Query()
            .Include(e => e.User)
            .Include(e => e.Quiz)
            .AsQueryable();

        if (quizId.HasValue)
            query = query.Where(e => e.QuizId == quizId.Value);

        if (from.HasValue)
            query = query.Where(e => e.AchievedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(e => e.AchievedAt <= to.Value);

        var entries = await query
            .OrderByDescending(e => e.Score)
            .ThenBy(e => e.AchievedAt)
            .Take(top)
            .ToListAsync();

        var response = _mapper.Map<List<LeaderboardEntryResponse>>(entries);

        for (int i = 0; i < response.Count; i++)
        {
            response[i].Rank = i + 1;
        }

        return response;
    }
}