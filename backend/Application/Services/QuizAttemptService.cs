using AutoMapper;
using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Application.Exceptions;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public sealed class QuizAttemptService(IUnitOfWork unitOfWork, IMapper mapper) : IQuizAttemptService
{
    public async Task<QuizAttemptResponse> CreateAttemptAsync(int quizId, Guid userId)
    {
        var quizExists = await unitOfWork.Quizzes.Query()
            .AsNoTracking()
            .AnyAsync(q => q.Id == quizId);

        if (!quizExists)
        {
            throw new NotFoundException("Quiz not found.");
        }

        var existingAttempt = await unitOfWork.QuizAttempts.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.QuizId == quizId && a.UserId == userId && a.FinishedAt == null);

        if (existingAttempt != null)
            return mapper.Map<QuizAttemptResponse>(existingAttempt);

        var attempt = new QuizAttempt
        {
            QuizId = quizId,
            UserId = userId,
            StartedAt = DateTime.UtcNow,
            UserAnswers = []
        };

        await unitOfWork.QuizAttempts.AddAsync(attempt);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<QuizAttemptResponse>(attempt);
    }

    public async Task<QuizAttemptResponse?> FinishAttemptAsync(int attemptId, FinishQuizAttemptRequest request, Guid userId)
    {
        var attempt = await GetAttemptQuery(asNoTracking: false)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null) return null;

        if (attempt.UserId != userId)
        {
            throw new ForbiddenException("You do not have permission to finish this attempt.");
        }

        if (attempt.FinishedAt != null) return null;

        await unitOfWork.BeginTransactionAsync();

        try
        {
            attempt.UserAnswers.Clear();
            int totalScore = 0;
            var questionsById = attempt.Quiz.Questions.ToDictionary(q => q.Id);

            foreach (var answerRequest in request.Answers ?? [])
            {
                var hasSelectedOptions = answerRequest.SelectedAnswerOptionIds?.Any() == true;
                var hasTextAnswer = !string.IsNullOrWhiteSpace(answerRequest.TextAnswer);
                if (!hasSelectedOptions && !hasTextAnswer) continue;

                if (!questionsById.TryGetValue(answerRequest.QuestionId, out var question)) continue;

                bool isCorrect = CheckAnswerCorrectness(question, answerRequest);
                if (isCorrect) totalScore += question.Points;

                var userAnswer = new UserAnswer
                {
                    QuestionId = question.Id,
                    QuizAttemptId = attempt.Id,
                    TextAnswer = answerRequest.TextAnswer ?? string.Empty,
                    IsCorrect = isCorrect,
                    AnswerDetails = question.Type == QuestionType.FillInBlank
                        ? []
                        : (answerRequest.SelectedAnswerOptionIds ?? [])
                            .Select(id => new UserAnswerDetail { AnswerOptionId = id })
                            .ToList()
                };

                attempt.UserAnswers.Add(userAnswer);
            }

            attempt.Score = totalScore;
            attempt.FinishedAt = DateTime.UtcNow;

            await UpdateLeaderboard(attempt.QuizId, attempt.UserId, totalScore, attempt.FinishedAt.Value);
            await unitOfWork.SaveChangesAsync();
            await unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }

        return await GetAttemptByIdAsync(attemptId, userId);
    }

    public async Task<QuizAttemptResponse?> GetActiveAttemptAsync(int quizId, Guid userId)
    {
        var activeAttempt = await GetAttemptQuery(asNoTracking: true)
            .Where(a => a.QuizId == quizId && a.UserId == userId && a.FinishedAt == null)
            .OrderByDescending(a => a.StartedAt)
            .FirstOrDefaultAsync();

        return activeAttempt == null ? null : mapper.Map<QuizAttemptResponse>(activeAttempt);
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetUserAttemptsAsync(Guid userId)
    {
        var attempts = await unitOfWork.QuizAttempts.Query()
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return await BuildAttemptResponsesAsync(attempts);
    }

    public async Task<QuizAttemptResponse?> GetAttemptByIdAsync(int attemptId, Guid userId)
    {
        var attempt = await GetAttemptQuery(asNoTracking: true)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null) return null;

        if (attempt.UserId != userId)
        {
            throw new ForbiddenException("You do not have permission to access this attempt.");
        }

        return mapper.Map<QuizAttemptResponse>(attempt);
    }

    public async Task<List<MyQuizResultDto>> GetUserResultsAsync(Guid userId)
    {
        var attempts = await GetAttemptSummaryQuery()
            .Where(a => a.UserId == userId && a.FinishedAt != null)
            .OrderByDescending(a => a.FinishedAt)
            .ToListAsync();

        return mapper.Map<List<MyQuizResultDto>>(attempts);
    }

    public async Task<List<QuizProgressDto>> GetUserProgressAsync(Guid userId)
    {
        var quizAttempts = await GetAttemptSummaryQuery()
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var progressList = new List<QuizProgressDto>();

        foreach (var quizGroup in quizAttempts.GroupBy(a => a.QuizId))
        {
            var attempts = quizGroup.OrderBy(a => a.StartedAt).ToList();
            if (attempts.Count < 2) continue;

            var quizTitle = attempts.FirstOrDefault()?.Quiz?.Title ?? "[Unknown Quiz]";

            var attemptDtos = attempts.Select(attempt =>
            {
                var totalQuestions = attempt.Quiz?.Questions.Count ?? 0;
                var correctAnswers = attempt.UserAnswers?.Count(ua => ua.IsCorrect) ?? 0;
                var percentage = totalQuestions > 0 ? (int)Math.Round((double)correctAnswers / totalQuestions * 100) : 0;
                var duration = attempt.FinishedAt.HasValue ? (int)(attempt.FinishedAt.Value - attempt.StartedAt).TotalMinutes : 0;

                return new QuizAttemptProgressDto(
                    AttemptId: attempt.Id,
                    Score: attempt.Score,
                    Percentage: percentage,
                    Date: attempt.FinishedAt ?? attempt.StartedAt,
                    Duration: duration
                );
            }).ToList();

            var percentages = attemptDtos.Select(a => a.Percentage).ToList();
            var bestScore = percentages.Max();
            var averageScore = (int)Math.Round(percentages.Average());
            var improvement = attemptDtos.Count >= 2 ? attemptDtos.Last().Percentage - attemptDtos.First().Percentage : 0;

            progressList.Add(new QuizProgressDto(
                QuizId: quizGroup.Key,
                QuizTitle: quizTitle,
                Attempts: attemptDtos,
                BestScore: bestScore,
                AverageScore: averageScore,
                Improvement: improvement
            ));
        }

        return progressList;
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetAllQuizAttemptsAsync()
    {
        var attempts = await unitOfWork.QuizAttempts.Query()
            .AsNoTracking()
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();

        return await BuildAttemptResponsesAsync(attempts);
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetQuizAttemptsByQuizAsync(int quizId)
    {
        var attempts = await unitOfWork.QuizAttempts.Query()
            .AsNoTracking()
            .Where(a => a.QuizId == quizId)
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();

        return await BuildAttemptResponsesAsync(attempts);
    }

    // --- Private helpers ---
    private IQueryable<QuizAttempt> GetAttemptQuery(bool asNoTracking = true)
    {
        var query = unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question);

        return asNoTracking ? query.AsNoTracking() : query;
    }

    private IQueryable<QuizAttempt> GetAttemptSummaryQuery(bool asNoTracking = true)
    {
        var query = unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.UserAnswers);

        return asNoTracking ? query.AsNoTracking() : query;
    }

    private bool CheckAnswerCorrectness(Question question, UserAnswerRequest answerRequest)
    {
        var selectedOptionIds = answerRequest.SelectedAnswerOptionIds?.ToList() ?? [];

        return question.Type switch
        {
            QuestionType.FillInBlank => string.Equals(
                question.AnswerOptions.FirstOrDefault(o => o.IsCorrect)?.Text?.Trim(),
                answerRequest.TextAnswer?.Trim(),
                StringComparison.OrdinalIgnoreCase
            ),
            QuestionType.SingleChoice or QuestionType.TrueFalse =>
                question.AnswerOptions.FirstOrDefault(o => o.Id == selectedOptionIds.FirstOrDefault())?.IsCorrect ?? false,
            QuestionType.MultipleChoice =>
                IsMultipleChoiceCorrect(question, selectedOptionIds),
            _ => false
        };
    }

    private static bool IsMultipleChoiceCorrect(Question question, List<int> selectedOptionIds)
    {
        var selectedUnique = selectedOptionIds.ToHashSet();
        if (selectedUnique.Count != selectedOptionIds.Count)
        {
            return false;
        }

        var correctIds = question.AnswerOptions
            .Where(o => o.IsCorrect)
            .Select(o => o.Id)
            .ToHashSet();

        return correctIds.SetEquals(selectedUnique);
    }

    private async Task<List<QuizAttemptResponse>> BuildAttemptResponsesAsync(List<QuizAttempt> attempts)
    {
        if (attempts.Count == 0)
        {
            return [];
        }

        var attemptIds = attempts.Select(a => a.Id).ToList();
        var quizIds = attempts.Select(a => a.QuizId).Distinct().ToList();

        var questionCounts = await unitOfWork.Questions.Query()
            .AsNoTracking()
            .Where(q => quizIds.Contains(q.QuizId))
            .GroupBy(q => q.QuizId)
            .Select(g => new { QuizId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.QuizId, x => x.Count);

        var userAnswers = await unitOfWork.UserAnswers.Query()
            .AsNoTracking()
            .Where(ua => attemptIds.Contains(ua.QuizAttemptId))
            .Include(ua => ua.Question)
                .ThenInclude(q => q.AnswerOptions)
            .Include(ua => ua.AnswerDetails)
                .ThenInclude(ad => ad.AnswerOption)
            .ToListAsync();

        var answersByAttemptId = userAnswers
            .GroupBy(ua => ua.QuizAttemptId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var responses = new List<QuizAttemptResponse>(attempts.Count);

        foreach (var attempt in attempts)
        {
            var totalQuestions = questionCounts.TryGetValue(attempt.QuizId, out var count) ? count : 0;
            var answers = answersByAttemptId.TryGetValue(attempt.Id, out var uaList) ? uaList : [];
            attempt.UserAnswers = answers;

            var response = mapper.Map<QuizAttemptResponse>(attempt);
            response.TotalQuestions = totalQuestions;
            responses.Add(response);
        }

        return responses;
    }

    private async Task UpdateLeaderboard(int quizId, Guid userId, int score, DateTime achievedAt)
    {
        var entry = await unitOfWork.LeaderboardEntries.Query()
            .FirstOrDefaultAsync(e => e.QuizId == quizId && e.UserId == userId);

        if (entry != null)
        {
            if (score > entry.Score)
            {
                entry.Score = score;
                entry.AchievedAt = achievedAt;
            }
        }
        else
        {
            await unitOfWork.LeaderboardEntries.AddAsync(new LeaderboardEntry
            {
                QuizId = quizId,
                UserId = userId,
                Score = score,
                AchievedAt = achievedAt
            });
        }
    }
}