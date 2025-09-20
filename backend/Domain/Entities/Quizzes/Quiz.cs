using KvizHub.Domain.Enums;

namespace KvizHub.Domain.Entities.Quizzes;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public Difficulty Difficulty { get; set; }

    public ICollection<Question> Questions { get; set; } = [];
    public ICollection<QuizCategory> QuizCategories { get; set; } = [];
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
    public ICollection<LeaderboardEntry> LeaderboardEntries { get; set; } = [];
}