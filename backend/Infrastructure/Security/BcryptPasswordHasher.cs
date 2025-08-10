using KvizHub.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace KvizHub.Infrastructure.Security;

public class BcryptPasswordHasher : IPasswordHasher<User>
{
    public string HashPassword(User user, string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    public PasswordVerificationResult VerifyHashedPassword(User user, string hashedPassword, string providedPassword)
        => BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword)
            ? PasswordVerificationResult.Success
            : PasswordVerificationResult.Failed;
}
