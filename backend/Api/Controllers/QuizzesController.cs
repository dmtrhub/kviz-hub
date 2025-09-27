using KvizHub.Application.DTOs.Question;
using KvizHub.Application.DTOs.Quiz;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Api.Controllers;

[ApiController]
[Route("api/quizzes")]
[Authorize]
public class QuizzesController : ControllerBase
{
    private readonly IQuizService _quizService;
    private readonly IQuestionService _questionService;

    public QuizzesController(IQuizService quizService, IQuestionService questionService)
    {
        _quizService = quizService;
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuizResponse>>> GetQuizzes([FromQuery] QuizFilterRequest filter)
    {
        var quizzes = await _quizService.GetQuizzesAsync(filter);
        return Ok(quizzes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuizResponse>> GetQuizById(int id)
    {
        var quiz = await _quizService.GetQuizByIdAsync(id);
        if (quiz == null)
            return NotFound();

        return Ok(quiz);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<QuizResponse>> CreateQuiz(CreateQuizRequest request)
    {
        var createdQuiz = await _quizService.CreateQuizAsync(request);
        return CreatedAtAction(nameof(GetQuizById), new { id = createdQuiz.Id }, createdQuiz);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateQuiz(int id, UpdateQuizRequest request)
    {
        var updatedQuiz = await _quizService.UpdateQuizAsync(id, request);
        if (updatedQuiz == null) return NotFound();
        return Ok(updatedQuiz);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var deleted = await _quizService.DeleteQuizAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpPost("{quizId}/questions")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<QuestionResponse>> AddQuestionToQuiz(int quizId, CreateQuestionRequest request)
    {
        var question = await _questionService.CreateQuestionAsync(quizId, request);
        return CreatedAtAction(nameof(GetQuestionsForQuiz), new { quizId = quizId }, question);
    }

    [HttpGet("{quizId}/questions")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<QuestionResponse>>> GetQuestionsForQuiz(int quizId)
    {
        var questions = await _questionService.GetByQuizIdAsync(quizId);
        return Ok(questions);
    }
}