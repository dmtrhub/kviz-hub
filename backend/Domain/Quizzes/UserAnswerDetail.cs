namespace KvizHub.Domain.Quizzes;

public class UserAnswerDetail
{
    public Guid Id { get; set; }
    public Guid UserAnswerId { get; set; }
    public Guid? AnswerOptionId { get; set; } // Null for fill-in-blank
    public string TextAnswer { get; set; } // For fill-in-blank questions

    // Navigation properties
    public UserAnswer UserAnswer { get; set; }
    public AnswerOption AnswerOption { get; set; }
}
