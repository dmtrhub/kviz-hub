using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KvizHub.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize(Roles = "User")]
public class QuizAttemptsController : ControllerBase
{
    private readonly IQuizAttemptService _quizAttemptService;

    public QuizAttemptsController(IQuizAttemptService quizAttemptService)
    {
        _quizAttemptService = quizAttemptService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("quizzes/{quizId}/attempts")]
    public async Task<ActionResult<QuizAttemptResponse>> CreateAttempt(int quizId)
    {
        var userId = GetUserId();
        var attempt = await _quizAttemptService.CreateAttemptAsync(quizId, userId);
        return Ok(attempt);
    }

    [HttpPut("attempts/{attemptId}/finish")]
    public async Task<ActionResult<QuizAttemptResponse>> FinishAttempt(int attemptId, FinishQuizAttemptRequest request)
    {
        var userId = GetUserId();
        var result = await _quizAttemptService.FinishAttemptAsync(attemptId, request, userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("users/me/attempts")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetUserAttempts()
    {
        var userId = GetUserId();
        var attempts = await _quizAttemptService.GetUserAttemptsAsync(userId);
        return Ok(attempts);
    }

    [HttpGet("attempts/{attemptId}")]
    public async Task<ActionResult<QuizAttemptResponse>> GetAttemptById(int attemptId)
    {
        var userId = GetUserId();
        var attempt = await _quizAttemptService.GetAttemptByIdAsync(attemptId, userId);
        if (attempt == null) return NotFound();
        return Ok(attempt);
    }
}