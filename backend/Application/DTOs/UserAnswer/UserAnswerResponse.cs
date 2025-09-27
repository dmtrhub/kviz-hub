namespace KvizHub.Application.DTOs.UserAnswer;

public record UserAnswerResponse(
    int QuestionId,
    IEnumerable<UserAnswerDetailResponse> Details
);