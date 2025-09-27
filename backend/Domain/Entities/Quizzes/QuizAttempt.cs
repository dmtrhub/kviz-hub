using KvizHub.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace KvizHub.Domain.Entities.Quizzes;

public class QuizAttempt
{
    public int Id { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? FinishedAt { get; set; }
    public int Score { get; set; }

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();

    [NotMapped]
    public bool IsFinished => FinishedAt.HasValue;
}