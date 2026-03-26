namespace KvizHub.Application.DTOs.Quiz;

public record PaginatedQuizResult(
    List<QuizResponse> Items,
    int TotalCount,
    int Page,
    int PageSize
)
{
    public int TotalPages => PageSize > 0
        ? (int)Math.Ceiling((double)TotalCount / PageSize)
        : 1;
}
