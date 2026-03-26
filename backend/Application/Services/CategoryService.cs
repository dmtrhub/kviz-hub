using AutoMapper;
using KvizHub.Application.DTOs.Category;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Services;

public class CategoryService(IMapper mapper, IUnitOfWork unitOfWork) : ICategoryService
{
    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var categories = await unitOfWork.Categories.GetAllAsync();
        return mapper.Map<IEnumerable<CategoryResponse>>(categories);
    }

    public async Task<CategoryResponse?> GetByIdAsync(int id)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        return mapper.Map<CategoryResponse?>(category);
    }

    public async Task<CategoryResponse> CreateAsync(CategoryRequest request)
    {
        var category = mapper.Map<Category>(request);

        await unitOfWork.Categories.AddAsync(category);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse?> UpdateAsync(int id, CategoryRequest request)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return null;

        mapper.Map(request, category);

        await unitOfWork.SaveChangesAsync();
        return mapper.Map<CategoryResponse>(category);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return false;

        unitOfWork.Categories.Remove(category);
        await unitOfWork.SaveChangesAsync();
        return true;
    }
}