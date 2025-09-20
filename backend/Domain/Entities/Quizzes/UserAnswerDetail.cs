namespace KvizHub.Domain.Entities.Quizzes;

public class UserAnswerDetail
{
    public int Id { get; set; }
    public int UserAnswerId { get; set; }
    public UserAnswer UserAnswer { get; set; } = default!;
    public int AnswerOptionId { get; set; }
    public AnswerOption AnswerOption { get; set; } = default!;
}