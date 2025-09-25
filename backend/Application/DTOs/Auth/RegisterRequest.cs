using Microsoft.AspNetCore.Http;

namespace KvizHub.Application.DTOs.Auth;

public record RegisterRequest(
    string Username,
    string Email,
    string Password,
    IFormFile? Avatar
);