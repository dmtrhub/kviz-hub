using KvizHub.Domain.Enums;

namespace KvizHub.Domain.Entities.Quizzes;

public class AnswerOption
{
    public int Id { get; set; }
    public string Text { get; set; } = default!;
    public bool IsCorrect { get; set; }

    public int QuestionId { get; set; }
    public Question Question { get; set; } = default!;
}