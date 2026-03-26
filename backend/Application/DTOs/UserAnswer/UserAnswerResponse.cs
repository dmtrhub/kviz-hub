namespace KvizHub.Application.DTOs.UserAnswer;

public class UserAnswerResponse
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string QuestionType { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int Points { get; set; }
    public List<int> SelectedOptionIds { get; set; } = [];
    public string TextAnswer { get; set; } = string.Empty;
    public List<UserAnswerDetailResponse> Details { get; set; } = [];
}