using FluentValidation;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.Validators.UserAnswer;

namespace KvizHub.Application.Validators.QuizAttempt;

public class FinishQuizAttemptRequestValidator : AbstractValidator<FinishQuizAttemptRequest>
{
    public FinishQuizAttemptRequestValidator()
    {
        RuleForEach(x => x.Answers).SetValidator(new UserAnswerRequestValidator());
    }
}