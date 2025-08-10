using KvizHub.Domain.Quizzes;
using Microsoft.AspNetCore.Identity;

namespace KvizHub.Domain.Users;

public class User : IdentityUser<Guid>
{
    public string DisplayName { get; set; }
    public string AvatarUrl { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastActive { get; set; }

    // Additional properties for user statistics
    public int TotalQuizzesTaken { get; set; }
    public int TotalCorrectAnswers { get; set; }
    public int TotalQuestionsAttempted { get; set; }
    public DateTime? LastQuizAttemptDate { get; set; }

    // Navigation properties
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
}
