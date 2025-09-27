using FluentValidation;
using KvizHub.Application.DTOs.Quiz;

namespace KvizHub.Application.Validators.Quiz;

public class UpdateQuizRequestValidator : AbstractValidator<UpdateQuizRequest>
{
    public UpdateQuizRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title can have max 100 characters.");

        RuleFor(q => q.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(1000).WithMessage("Description can have max 1000 characters.");

        RuleFor(q => q.TimeLimit)
            .GreaterThan(0).WithMessage("TimeLimit must be greater than 0.");

        RuleFor(q => q.Difficulty)
            .IsInEnum().WithMessage("Invalid difficulty value.");

        RuleForEach(q => q.CategoryIds)
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0.");
    }
}