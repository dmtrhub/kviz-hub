using FluentValidation;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.Validators.UserAnswer;

public class UserAnswerRequestValidator : AbstractValidator<UserAnswerRequest>
{
    public UserAnswerRequestValidator()
    {
        RuleFor(x => x.QuestionId)
            .GreaterThan(0).WithMessage("QuestionId must be valid.");

        RuleFor(x => x.QuestionId)
            .GreaterThan(0).WithMessage("QuestionId must be valid.");

        // Umesto stroge validacije, dozvoli oba slučaja
        RuleFor(x => x)
            .Must(x => x.SelectedAnswerOptionIds.Any() || !string.IsNullOrEmpty(x.TextAnswer))
            .WithMessage("Either selected options or text answer must be provided.");
    }
}