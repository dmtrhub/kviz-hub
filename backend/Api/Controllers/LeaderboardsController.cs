using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Api.Controllers;

[ApiController]
[Route("api/leaderboards")]
[Authorize]
public class LeaderboardController : ControllerBase
{
    private readonly ILeaderboardService _leaderboardService;

    public LeaderboardController(ILeaderboardService leaderboardService)
    {
        _leaderboardService = leaderboardService;
    }

    [HttpGet("quiz/{quizId}")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntryResponse>>> GetQuizLeaderboard(int quizId, [FromQuery] int top = 10)
    {
        var leaderboard = await _leaderboardService.GetQuizLeaderboardAsync(quizId, top);
        return Ok(leaderboard);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntryResponse>>> GetGlobalLeaderboard(
        [FromQuery] int? quizId = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] int top = 10)
    {
        var leaderboard = await _leaderboardService.GetGlobalLeaderboardAsync(quizId, from, to, top);
        return Ok(leaderboard);
    }
}