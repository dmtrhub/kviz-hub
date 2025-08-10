namespace KvizHub.Domain.Quizzes;

public class QuizCategory
{
    public Guid QuizId { get; set; }
    public Guid CategoryId { get; set; }

    // Navigation properties
    public Quiz Quiz { get; set; }
    public Category Category { get; set; }
}
