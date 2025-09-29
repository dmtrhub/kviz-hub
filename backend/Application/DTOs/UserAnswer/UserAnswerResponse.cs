namespace KvizHub.Application.DTOs.UserAnswer;

public record UserAnswerResponse(
    int QuestionId,
    string QuestionText,
    string QuestionType,
    bool IsCorrect,
    int Points,
    List<int> SelectedOptionIds,
    string TextAnswer,
    IEnumerable<UserAnswerDetailResponse> Details
);