using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;

namespace KvizHub.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);
}