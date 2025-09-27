using KvizHub.Application.DTOs.Question;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Api.Controllers
{
    [Route("api/questions")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var questions = await _questionService.GetQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var question = await _questionService.GetByIdAsync(id);
            if (question == null) return NotFound();
            return Ok(question);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateQuestionRequest request)
        {
            var updated = await _questionService.UpdateQuestionAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _questionService.DeleteQuestionAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}