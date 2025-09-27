using AutoMapper;
using KvizHub.Application.DTOs.Category;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public class CategoryMappingProfile : Profile
{
    public CategoryMappingProfile()
    {
        CreateMap<Category, CategoryResponse>();
        CreateMap<CategoryRequest, Category>();
    }
}