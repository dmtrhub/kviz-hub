using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;
using KvizHub.Application.Interfaces;

namespace KvizHub.Api.IntegrationTests.TestInfrastructure;

public class FakeAuthService : IAuthService
{
    public Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var user = new UserResponse
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            AvatarUrl = null,
            Role = "User"
        };

        var response = new AuthResponse("fake-register-token", DateTime.UtcNow.AddHours(2), user);
        return Task.FromResult(response);
    }

    public Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        if (string.Equals(request.Identifier, "missing-user", StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        var user = new UserResponse
        {
            Id = Guid.NewGuid(),
            Username = request.Identifier,
            Email = $"{request.Identifier}@test.local",
            AvatarUrl = null,
            Role = "User"
        };

        var response = new AuthResponse("fake-login-token", DateTime.UtcNow.AddHours(2), user);
        return Task.FromResult(response);
    }
}
