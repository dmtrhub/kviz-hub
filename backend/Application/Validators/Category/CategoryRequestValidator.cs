using FluentValidation;
using KvizHub.Application.DTOs.Category;

namespace KvizHub.Application.Validators.Category;

public class CategoryRequestValidator : AbstractValidator<CategoryRequest>
{
    public CategoryRequestValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MaximumLength(100).WithMessage("Category name can be at most 100 characters.");

        RuleFor(c => c.Description)
            .MaximumLength(500).WithMessage("Category description can be at most 500 characters.");
    }
}