namespace KvizHub.Domain.Entities.Quizzes;

public class UserAnswer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; } = default!;
    public int QuizAttemptId { get; set; }
    public QuizAttempt QuizAttempt { get; set; } = default!;

    public ICollection<UserAnswerDetail> AnswerDetails { get; set; } = new List<UserAnswerDetail>();
}