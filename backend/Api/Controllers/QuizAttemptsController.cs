using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KvizHub.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class QuizAttemptsController(IQuizAttemptService quizAttemptService) : ControllerBase
{
    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("quizzes/{quizId}/attempts")]
    public async Task<ActionResult<QuizAttemptResponse>> CreateAttempt(int quizId)
    {
        var userId = GetUserId();
        var attempt = await quizAttemptService.CreateAttemptAsync(quizId, userId);
        return Ok(attempt);
    }

    [HttpPut("attempts/{attemptId}/finish")]
    public async Task<ActionResult<QuizAttemptResponse>> FinishAttempt(int attemptId, FinishQuizAttemptRequest request)
    {
        var userId = GetUserId();
        var result = await quizAttemptService.FinishAttemptAsync(attemptId, request, userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("users/me/attempts")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetUserAttempts()
    {
        var userId = GetUserId();
        var attempts = await quizAttemptService.GetUserAttemptsAsync(userId);
        return Ok(attempts);
    }

    [HttpGet("attempts/{attemptId}")]
    public async Task<ActionResult<QuizAttemptResponse>> GetAttemptById(int attemptId)
    {
        var userId = GetUserId();
        var attempt = await quizAttemptService.GetAttemptByIdAsync(attemptId, userId);
        if (attempt == null) return NotFound();
        return Ok(attempt);
    }

    [HttpGet("quizzes/{quizId}/active-attempt")]
    public async Task<ActionResult<QuizAttemptResponse>> GetActiveAttempt(int quizId)
    {
        var userId = GetUserId();
        var activeAttempt = await quizAttemptService.GetActiveAttemptAsync(quizId, userId);

        if (activeAttempt == null)
        {
            return NotFound();
        }

        return Ok(activeAttempt);
    }

    [HttpGet("my-results")]
    [Authorize]
    public async Task<ActionResult<List<MyQuizResultDto>>> GetMyResults()
    {
        var userId = GetUserId();
        var results = await quizAttemptService.GetUserResultsAsync(userId);
        return Ok(results);
    }

    [HttpGet("my-progress")]
    [Authorize]
    public async Task<ActionResult<List<QuizProgressDto>>> GetMyProgress()
    {
        var userId = GetUserId();
        var progress = await quizAttemptService.GetUserProgressAsync(userId);
        return Ok(progress);
    }

    [HttpGet("admin/quiz-attempts")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetAllQuizAttempts()
    {
        var attempts = await quizAttemptService.GetAllQuizAttemptsAsync();
        return Ok(attempts);
    }

    [HttpGet("admin/quizzes/{quizId}/attempts")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetQuizAttemptsByQuiz(int quizId)
    {
        var attempts = await quizAttemptService.GetQuizAttemptsByQuizAsync(quizId);
        return Ok(attempts);
    }
}