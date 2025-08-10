namespace KvizHub.Domain.Quizzes;

public class Question
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuizId { get; set; }
    public string Text { get; set; } = default!;
    public QuestionType Type { get; set; }
    public int Points { get; set; }
    public int TimeLimitSeconds { get; set; } // 0 means use quiz default
    public int Order { get; set; }

    public Quiz Quiz { get; set; }
    public ICollection<AnswerOption> Options { get; set; } = [];
    public ICollection<UserAnswer> UserAnswers { get; set; } = [];
}
