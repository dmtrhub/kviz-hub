using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Interfaces;

public interface IAuthService
{
    Task<UserResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);
}