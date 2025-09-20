namespace KvizHub.Application.DTOs;

public record UserResponse
{
    public Guid Id { get; init; }
    public string Username { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string? AvatarUrl { get; init; }
}