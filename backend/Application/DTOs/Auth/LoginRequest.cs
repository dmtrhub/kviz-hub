namespace KvizHub.Application.DTOs.Auth;

public record LoginRequest(
    string Identifier,
    string Password
);