using FluentValidation;
using KvizHub.Application.DTOs.UserAnswer;

namespace KvizHub.Application.Validators.UserAnswer;

public class UserAnswerRequestValidator : AbstractValidator<UserAnswerRequest>
{
    public UserAnswerRequestValidator()
    {
        RuleFor(x => x.QuestionId)
            .GreaterThan(0).WithMessage("QuestionId must be valid.");
    }
}