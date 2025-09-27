using KvizHub.Domain.Enums;

namespace KvizHub.Domain.Entities.Quizzes;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = default!;
    public QuestionType Type { get; set; }
    public int Points { get; set; } = 1;

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public ICollection<AnswerOption> AnswerOptions { get; set; } = new List<AnswerOption>();
    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}