namespace KvizHub.Domain.Quizzes;

public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    // Navigation property
    public ICollection<QuizCategory> QuizCategories { get; set; } = [];
}
