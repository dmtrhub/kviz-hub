using FluentValidation;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Korisničko ime ili email je obavezan")
            .MaximumLength(100).WithMessage("Prekoračena maksimalna dužina od 100 karaktera");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Lozinka je obavezna");
    }
}