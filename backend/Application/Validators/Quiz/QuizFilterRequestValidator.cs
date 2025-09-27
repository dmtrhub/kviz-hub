using FluentValidation;
using KvizHub.Application.DTOs.Quiz;

namespace KvizHub.Application.Validators.Quiz;

public class QuizFilterRequestValidator : AbstractValidator<QuizFilterRequest>
{
    public QuizFilterRequestValidator()
    {
        RuleFor(q => q.CategoryId)
            .GreaterThan(0).When(q => q.CategoryId.HasValue)
            .WithMessage("CategoryId must be greater than 0.");

        RuleFor(q => q.Difficulty)
            .IsInEnum().When(q => q.Difficulty.HasValue)
            .WithMessage("Invalid difficulty value.");
    }
}
