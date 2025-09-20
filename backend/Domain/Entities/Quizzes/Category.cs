namespace KvizHub.Domain.Entities.Quizzes;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;

    public ICollection<QuizCategory> Quizzes { get; set; } = [];
}