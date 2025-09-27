using KvizHub.Application.DTOs.Category;

namespace KvizHub.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync();

    Task<CategoryResponse?> GetByIdAsync(int id);

    Task<CategoryResponse> CreateAsync(CategoryRequest request);

    Task<CategoryResponse?> UpdateAsync(int id, CategoryRequest request);

    Task<bool> DeleteAsync(int id);
}