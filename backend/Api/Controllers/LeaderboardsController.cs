using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    // GET: api/leaderboard
    [HttpGet]
    public async Task<IActionResult> GetLeaderboard([FromQuery] LeaderboardFilter filter)
    {
        var leaderboard = await _leaderboardService.GetLeaderboardAsync(filter);
        return Ok(leaderboard);
    }

    // GET: api/leaderboard/me
    [HttpGet("me")]
    public async Task<IActionResult> GetMyRank([FromQuery] LeaderboardFilter filter)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var myRank = await _leaderboardService.GetUserRankAsync(userId, filter);
        return Ok(myRank);
    }
}