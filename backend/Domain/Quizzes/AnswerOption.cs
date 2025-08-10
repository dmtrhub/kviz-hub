namespace KvizHub.Domain.Quizzes;

public class AnswerOption
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuestionId { get; set; }
    public string Text { get; set; } = default!;
    public bool IsCorrect { get; set; }
    public int Order { get; set; }

    // Navigation property
    public Question Question { get; set; }
}
