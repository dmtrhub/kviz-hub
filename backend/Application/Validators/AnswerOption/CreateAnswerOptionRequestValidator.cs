using FluentValidation;
using KvizHub.Application.DTOs.AnswerOption;

namespace KvizHub.Application.Validators.AnswerOption;

public class CreateAnswerOptionRequestValidator : AbstractValidator<CreateAnswerOptionRequest>
{
    public CreateAnswerOptionRequestValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Answer option text is required.")
            .MaximumLength(500).WithMessage("Answer option text can be at most 500 characters.");

        RuleFor(x => x.IsCorrect)
            .NotNull().WithMessage("IsCorrect must be specified.");
    }
}