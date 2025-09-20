using KvizHub.Domain.Enums;

namespace KvizHub.Domain.Entities.Quizzes;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = default!;
    public QuestionType Type { get; set; }

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public ICollection<AnswerOption> AnswerOptions { get; set; } = [];
    public ICollection<UserAnswer> UserAnswers { get; set; } = [];
}