using KvizHub.Domain.Users;

namespace KvizHub.Domain.Quizzes;

public class LeaderboardEntry
{
    public Guid Id { get; set; }
    public Guid QuizId { get; set; }
    public Guid UserId { get; set; }
    public int Score { get; set; }
    public DateTime CompletedAt { get; set; }
    public TimeSpan TimeTaken { get; set; }

    // Navigation properties
    public Quiz Quiz { get; set; }
    public User User { get; set; }
}
