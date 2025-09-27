using AutoMapper;
using KvizHub.Application.DTOs.Category;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return _mapper.Map<IEnumerable<CategoryResponse>>(categories);
    }

    public async Task<CategoryResponse?> GetByIdAsync(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        return category == null ? null : _mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse> CreateAsync(CategoryRequest request)
    {
        var category = _mapper.Map<Category>(request);
        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse?> UpdateAsync(int id, CategoryRequest request)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return null;

        _mapper.Map(request, category);

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return false;

        _unitOfWork.Categories.Remove(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}