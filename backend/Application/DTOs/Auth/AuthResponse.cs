namespace KvizHub.Application.DTOs.Auth;

public record AuthResponse(
    string Token,
    DateTime Expiration
);