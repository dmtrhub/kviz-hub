using FluentValidation;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Username or email is required")
            .MaximumLength(100).WithMessage("Maximum length of 100 characters exceeded");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}