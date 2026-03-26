using KvizHub.Application.DTOs.UserAnswer;

namespace KvizHub.Application.DTOs.QuizAttempt;

public class QuizAttemptResponse
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public Guid UserId { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public List<UserAnswerResponse> Answers { get; set; } = [];
}