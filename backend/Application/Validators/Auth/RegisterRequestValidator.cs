using FluentValidation;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters long")
            .MaximumLength(30).WithMessage("Username cannot be longer than 30 characters")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Only letters, numbers, and underscores are allowed");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required")
            .EmailAddress().WithMessage("Invalid email address format")
            .MaximumLength(50).WithMessage("Email address cannot be longer than 50 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
            .Matches("[0-9]").WithMessage("Password must contain at least one number")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character");

        RuleFor(x => x.Avatar)
            .Must(file => file == null || file.ContentType.StartsWith("image/"))
            .WithMessage("Avatar must be an image")
            .Must(file => file == null || file.Length <= 2_000_000)
            .WithMessage("Avatar must be smaller than 2MB");
    }
}