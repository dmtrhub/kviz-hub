namespace KvizHub.Domain.Entities.Quizzes;

public class UserAnswer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; } = default!;
    public int QuizAttemptId { get; set; }
    public QuizAttempt QuizAttempt { get; set; } = default!;
    public string TextAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }

    public ICollection<UserAnswerDetail> AnswerDetails { get; set; } = new List<UserAnswerDetail>();
}