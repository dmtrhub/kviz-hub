namespace KvizHub.Domain.Quizzes;

public class UserAnswer
{
    public Guid Id { get; set; }
    public Guid AttemptId { get; set; }
    public Guid QuestionId { get; set; }
    public DateTime AnsweredAt { get; set; }
    public bool IsCorrect { get; set; }
    public int PointsEarned { get; set; }
    public TimeSpan TimeTaken { get; set; }

    // Navigation properties
    public QuizAttempt Attempt { get; set; }
    public Question Question { get; set; }
    public ICollection<UserAnswerDetail> AnswerDetails { get; set; } = [];
}
