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

    [HttpGet("quizzes/{quizId}/active-attempt")]
    public async Task<ActionResult<QuizAttemptResponse>> GetActiveAttempt(int quizId)
    {
        try
        {
            var userId = GetUserId();

            var activeAttempt = await _quizAttemptService.GetActiveAttemptAsync(quizId, userId);

            if (activeAttempt == null)
            {
                Console.WriteLine("No active attempt found");
                return NotFound();
            }

            Console.WriteLine("Active attempt found");
            return Ok(activeAttempt);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetActiveAttempt: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("my-results")]
    [Authorize]
    public async Task<ActionResult<List<MyQuizResultDto>>> GetMyResults()
    {
        var userId = GetUserId();
        var results = await _quizAttemptService.GetUserResultsAsync(userId);
        return Ok(results);
    }

    [HttpGet("my-progress")]
    [Authorize]
    public async Task<ActionResult<List<QuizProgressDto>>> GetMyProgress()
    {
        var userId = GetUserId();
        var progress = await _quizAttemptService.GetUserProgressAsync(userId);
        return Ok(progress);
    }

    [HttpGet("admin/quiz-attempts")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetAllQuizAttempts()
    {
        var attempts = await _quizAttemptService.GetAllQuizAttemptsAsync();
        return Ok(attempts);
    }

    [HttpGet("admin/quizzes/{quizId}/attempts")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<QuizAttemptResponse>>> GetQuizAttemptsByQuiz(int quizId)
    {
        var attempts = await _quizAttemptService.GetQuizAttemptsByQuizAsync(quizId);
        return Ok(attempts);
    }
}