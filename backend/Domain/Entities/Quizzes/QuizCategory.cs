namespace KvizHub.Domain.Entities.Quizzes;

public class QuizCategory
{
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = default!;
}