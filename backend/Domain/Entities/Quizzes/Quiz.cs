using KvizHub.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace KvizHub.Domain.Entities.Quizzes;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public Difficulty Difficulty { get; set; }
    public int TimeLimit { get; set; } // in minutes

    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<QuizCategory> QuizCategories { get; set; } = new List<QuizCategory>();
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    public ICollection<LeaderboardEntry> LeaderboardEntries { get; set; } = new List<LeaderboardEntry>();

    [NotMapped]
    public int MaxScore => Questions.Sum(q => q.Points);

    [NotMapped]
    public bool HasQuestions => Questions.Any();
}