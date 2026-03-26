using KvizHub.Application.DTOs.Question;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Api.Controllers
{
    [Route("api/questions")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class QuestionsController(IQuestionService questionService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var questions = await questionService.GetQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var question = await questionService.GetByIdAsync(id);
            if (question == null) return NotFound();
            return Ok(question);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateQuestionRequest request)
        {
            var updated = await questionService.UpdateQuestionAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await questionService.DeleteQuestionAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}