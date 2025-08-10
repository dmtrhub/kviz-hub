using KvizHub.Domain.Users;

namespace KvizHub.Domain.Quizzes;

public class QuizAttempt
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid QuizId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double ScorePercentage { get; set; }
    public int TotalPoints { get; set; }
    public int EarnedPoints { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Quiz Quiz { get; set; }
    public ICollection<UserAnswer> UserAnswers { get; set; } = [];
}
