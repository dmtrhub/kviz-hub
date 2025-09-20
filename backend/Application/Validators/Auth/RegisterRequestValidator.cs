using FluentValidation;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Korisničko ime je obavezno")
            .MinimumLength(3).WithMessage("Korisničko ime mora imati najmanje 3 karaktera")
            .MaximumLength(30).WithMessage("Korisničko ime ne sme biti duže od 30 karaktera")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Dozvoljeni su samo slova, brojevi i donja crta");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email adresa je obavezna")
            .EmailAddress().WithMessage("Nevažeći format email adrese")
            .MaximumLength(50).WithMessage("Email adresa ne sme biti duža od 50 karaktera");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Lozinka je obavezna")
            .MinimumLength(8).WithMessage("Lozinka mora imati najmanje 8 karaktera")
            .Matches("[A-Z]").WithMessage("Lozinka mora sadržati bar jedno veliko slovo")
            .Matches("[a-z]").WithMessage("Lozinka mora sadržati bar jedno malo slovo")
            .Matches("[0-9]").WithMessage("Lozinka mora sadržati bar jedan broj")
            .Matches("[^a-zA-Z0-9]").WithMessage("Lozinka mora sadržati bar jedan specijalni karakter");

        RuleFor(x => x.AvatarUrl)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Nevažeći URL formata avatara")
            .When(x => !string.IsNullOrEmpty(x.AvatarUrl));
    }
}