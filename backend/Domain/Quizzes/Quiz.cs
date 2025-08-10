namespace KvizHub.Domain.Quizzes;

public class Quiz
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int NumOfQuestions { get; set; } = default!;
    public string ImageUrl { get; set; }
    public Difficulty Difficulty { get; set; }
    public int TimeLimitMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public int TimesCompleted { get; set; }
    public double AverageRating { get; set; }

    // Navigation properties
    public ICollection<Question> Questions { get; set; } = [];
    public ICollection<QuizCategory> QuizCategories { get; set; } = [];
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
}
