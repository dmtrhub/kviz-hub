using KvizHub.Application.DTOs.Category;
using KvizHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize(Roles = "Admin")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryResponse>> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> Create(CategoryRequest request)
    {
        var category = await _categoryService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryResponse>> Update(int id, CategoryRequest request)
    {
        var category = await _categoryService.UpdateAsync(id, request);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _categoryService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}