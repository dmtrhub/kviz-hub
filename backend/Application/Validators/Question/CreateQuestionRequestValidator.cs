using FluentValidation;
using KvizHub.Application.DTOs.Question;
using KvizHub.Application.Validators.AnswerOption;

namespace KvizHub.Application.Validators.Question;

public class CreateQuestionRequestValidator : AbstractValidator<CreateQuestionRequest>
{
    public CreateQuestionRequestValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Text is required.")
            .MaximumLength(1000).WithMessage("Text can be at most 1000 characters.");

        RuleFor(x => x.Points)
            .GreaterThan(0).WithMessage("Points must be greater than 0.");

        RuleFor(x => x.AnswerOptions)
            .NotEmpty().WithMessage("At least one answer option is required.");

        RuleForEach(x => x.AnswerOptions).SetValidator(new CreateAnswerOptionRequestValidator());
    }
}