namespace KvizHub.Application.DTOs.UserAnswer;

public record UserAnswerRequest(
    int QuestionId,
    IEnumerable<int> SelectedAnswerOptionIds
);