using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;

namespace KvizHub.Domain.Entities.Users;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? AvatarUrl { get; set; }
    public string PasswordHash { get; set; } = default!;
    public UserRole Role { get; set; } = UserRole.User;

    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
    public ICollection<LeaderboardEntry> LeaderboardEntries { get; set; } = [];
}