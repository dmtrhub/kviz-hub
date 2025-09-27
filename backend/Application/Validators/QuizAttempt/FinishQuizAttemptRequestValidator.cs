using FluentValidation;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.Validators.UserAnswer;

namespace KvizHub.Application.Validators.QuizAttempt;

public class FinishQuizAttemptRequestValidator : AbstractValidator<FinishQuizAttemptRequest>
{
    public FinishQuizAttemptRequestValidator()
    {
        RuleFor(x => x.Answers)
            .NotEmpty().WithMessage("At least one answer must be provided.");

        RuleForEach(x => x.Answers).SetValidator(new UserAnswerRequestValidator());
    }
}