using KvizHub.Domain.Entities.Users;

namespace KvizHub.Domain.Entities.Quizzes;

public class LeaderboardEntry
{
    public int Id { get; set; }
    public int Score { get; set; }
    public DateTime AchievedAt { get; set; } = DateTime.UtcNow;
    public int Rank { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;
}