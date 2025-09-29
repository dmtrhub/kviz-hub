using AutoMapper;
using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;

public class QuizAttemptService : IQuizAttemptService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public QuizAttemptService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<QuizAttemptResponse> CreateAttemptAsync(int quizId, Guid userId)
    {
        var existingAttempt = await _unitOfWork.QuizAttempts.Query()
            .FirstOrDefaultAsync(a => a.QuizId == quizId && a.UserId == userId && a.FinishedAt == null);

        if (existingAttempt != null)
        {
            return _mapper.Map<QuizAttemptResponse>(existingAttempt);
        }

        var attempt = new QuizAttempt
        {
            QuizId = quizId,
            UserId = userId,
            StartedAt = DateTime.UtcNow
        };

        await _unitOfWork.QuizAttempts.AddAsync(attempt);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<QuizAttemptResponse>(attempt);
    }

    public async Task<QuizAttemptResponse?> FinishAttemptAsync(int attemptId, FinishQuizAttemptRequest request, Guid userId)
    {
        var attempt = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
            .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

        if (attempt == null || attempt.FinishedAt != null) return null;

        attempt.UserAnswers?.Clear();

        int totalScore = 0;

        foreach (var answerRequest in request.Answers)
        {
            var question = attempt.Quiz.Questions.FirstOrDefault(q => q.Id == answerRequest.QuestionId);
            if (question == null) continue;

            bool isCorrect = CheckAnswerCorrectness(question, answerRequest);
            int points = isCorrect ? question.Points : 0;

            if (isCorrect)
            {
                totalScore += points;
            }

            var userAnswer = new UserAnswer
            {
                QuestionId = question.Id,
                QuizAttemptId = attempt.Id,
                TextAnswer = answerRequest.TextAnswer ?? string.Empty,
                IsCorrect = isCorrect,
                AnswerDetails = new List<UserAnswerDetail>()
            };

            if (question.Type != QuestionType.FillInBlank)
            {
                foreach (var optionId in answerRequest.SelectedAnswerOptionIds)
                {
                    userAnswer.AnswerDetails.Add(new UserAnswerDetail
                    {
                        AnswerOptionId = optionId
                    });
                }
            }

            attempt.UserAnswers.Add(userAnswer);
        }

        attempt.Score = totalScore;
        attempt.FinishedAt = DateTime.UtcNow;

        await UpdateLeaderboard(attempt.QuizId, attempt.UserId, totalScore, attempt.FinishedAt.Value);
        await _unitOfWork.SaveChangesAsync();

        return await GetAttemptByIdAsync(attemptId, userId);
    }

    public async Task<QuizAttemptResponse?> GetActiveAttemptAsync(int quizId, Guid userId)
    {
        var activeAttempt = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question)
            .Where(a => a.QuizId == quizId && a.UserId == userId && a.FinishedAt == null)
            .OrderByDescending(a => a.StartedAt)
            .FirstOrDefaultAsync();

        return activeAttempt != null ? _mapper.Map<QuizAttemptResponse>(activeAttempt) : null;
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetUserAttemptsAsync(Guid userId)
    {
        var attempts = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question)
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return _mapper.Map<IEnumerable<QuizAttemptResponse>>(attempts);
    }

    public async Task<QuizAttemptResponse?> GetAttemptByIdAsync(int attemptId, Guid userId)
    {
        var attempt = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question)
            .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

        if (attempt == null) return null;

        return new QuizAttemptResponse(
            Id: attempt.Id,
            QuizId: attempt.QuizId,
            UserId: attempt.UserId,
            Score: attempt.Score,
            TotalQuestions: attempt.Quiz?.Questions?.Count ?? 0,
            CorrectAnswers: attempt.UserAnswers?.Count(ua => ua.IsCorrect) ?? 0,
            StartedAt: attempt.StartedAt,
            FinishedAt: attempt.FinishedAt,
            Answers: attempt.UserAnswers?.Select(ua => new UserAnswerResponse(
                QuestionId: ua.QuestionId,
                QuestionText: ua.Question?.Text ?? "[Unknown question]",
                QuestionType: ua.Question?.Type.ToString() ?? "Unknown",
                IsCorrect: ua.IsCorrect,
                Points: ua.IsCorrect ? (ua.Question?.Points ?? 1) : 0,
                SelectedOptionIds: ua.AnswerDetails?.Select(ad => ad.AnswerOptionId).ToList() ?? new List<int>(),
                TextAnswer: ua.TextAnswer,
                Details: GetAnswerDetails(ua)
            )).ToList() ?? new List<UserAnswerResponse>()
        );
    }

    public async Task<List<MyQuizResultDto>> GetUserResultsAsync(Guid userId)
    {
        var attempts = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.UserAnswers)
            .Where(a => a.UserId == userId && a.FinishedAt != null)
            .OrderByDescending(a => a.FinishedAt)
            .ToListAsync();

        var results = new List<MyQuizResultDto>();

        foreach (var attempt in attempts)
        {
            var totalQuestions = attempt.Quiz?.Questions.Count ?? 0;
            var correctAnswers = CalculateCorrectAnswers(attempt.UserAnswers);
            var percentage = totalQuestions > 0
                ? (int)Math.Round((double)correctAnswers / totalQuestions * 100)
                : 0;
            var duration = attempt.FinishedAt.HasValue
                ? (int)(attempt.FinishedAt.Value - attempt.StartedAt).TotalMinutes
                : 0;

            results.Add(new MyQuizResultDto(
                AttemptId: attempt.Id,
                QuizId: attempt.QuizId,
                QuizTitle: attempt.Quiz?.Title ?? "[Unknown Quiz]",
                Score: attempt.Score,
                MaxScore: totalQuestions,
                Percentage: percentage,
                CorrectAnswers: correctAnswers,
                TotalQuestions: totalQuestions,
                StartedAt: attempt.StartedAt,
                FinishedAt: attempt.FinishedAt!.Value,
                Duration: duration
            ));
        }

        return results;
    }

    public async Task<List<QuizProgressDto>> GetUserProgressAsync(Guid userId)
    {
        var quizAttempts = await _unitOfWork.QuizAttempts.Query()
            .Where(a => a.UserId == userId)
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .ToListAsync();

        var progressList = new List<QuizProgressDto>();

        var groupedByQuiz = quizAttempts.GroupBy(a => a.Quiz).ToList();

        foreach (var quizGroup in groupedByQuiz)
        {
            var attempts = quizGroup.OrderBy(a => a.StartedAt).ToList();
            if (attempts.Count < 2) continue;

            var attemptDtos = attempts.Select(attempt =>
            {
                var totalQuestions = attempt.Quiz?.Questions.Count ?? 0;
                var correctAnswers = CalculateCorrectAnswers(attempt.UserAnswers);
                var percentage = totalQuestions > 0
                    ? (int)Math.Round((double)correctAnswers / totalQuestions * 100)
                    : 0;
                var duration = attempt.FinishedAt.HasValue
                    ? (int)(attempt.FinishedAt.Value - attempt.StartedAt).TotalMinutes
                    : 0;

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
            var improvement = attemptDtos.Count >= 2
                ? attemptDtos.Last().Percentage - attemptDtos.First().Percentage
                : 0;

            progressList.Add(new QuizProgressDto(
                QuizId: quizGroup.Key?.Id ?? 0,
                QuizTitle: quizGroup.Key?.Title ?? "[Unknown Quiz]",
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
        var attempts = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.User)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();

        var responses = new List<QuizAttemptResponse>();

        foreach (var attempt in attempts)
        {
            var totalQuestions = attempt.Quiz?.Questions?.Count ?? 0;
            var correctAnswers = attempt.UserAnswers?.Count(ua => ua.IsCorrect) ?? 0;

            var response = new QuizAttemptResponse(
                Id: attempt.Id,
                QuizId: attempt.QuizId,
                UserId: attempt.UserId,
                Score: attempt.Score,
                TotalQuestions: totalQuestions,
                CorrectAnswers: correctAnswers,
                StartedAt: attempt.StartedAt,
                FinishedAt: attempt.FinishedAt,
                Answers: attempt.UserAnswers?.Select(ua => new UserAnswerResponse(
                    QuestionId: ua.QuestionId,
                    QuestionText: ua.Question?.Text ?? "[Unknown question]",
                    QuestionType: ua.Question?.Type.ToString() ?? "Unknown",
                    IsCorrect: ua.IsCorrect,
                    Points: ua.IsCorrect ? (ua.Question?.Points ?? 1) : 0,
                    SelectedOptionIds: ua.AnswerDetails?.Select(ad => ad.AnswerOptionId).ToList() ?? new List<int>(),
                    TextAnswer: ua.TextAnswer,
                    Details: GetAnswerDetails(ua)
                )).ToList() ?? new List<UserAnswerResponse>()
            );

            responses.Add(response);
        }

        return responses;
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetQuizAttemptsByQuizAsync(int quizId)
    {
        var attempts = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .Include(a => a.User)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.Question)
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Where(a => a.QuizId == quizId)
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<QuizAttemptResponse>>(attempts);
    }

    private int CalculateCorrectAnswers(ICollection<UserAnswer> userAnswers)
    {
        if (userAnswers == null || !userAnswers.Any()) return 0;
        return userAnswers.Count(ua => ua.IsCorrect);
    }

    private List<UserAnswerDetailResponse> GetAnswerDetails(UserAnswer userAnswer)
    {
        var details = new List<UserAnswerDetailResponse>();

        if (userAnswer.Question == null)
        {
            details.Add(new UserAnswerDetailResponse("Question data not available", false));
            return details;
        }

        if (userAnswer.Question.Type == QuestionType.FillInBlank)
        {
            details.Add(new UserAnswerDetailResponse(
                Text: $"Your answer: {(string.IsNullOrEmpty(userAnswer.TextAnswer) ? "[No answer]" : userAnswer.TextAnswer)}",
                IsCorrect: userAnswer.IsCorrect
            ));

            var correctOption = userAnswer.Question.AnswerOptions.FirstOrDefault(ao => ao.IsCorrect);
            if (correctOption != null)
            {
                details.Add(new UserAnswerDetailResponse(
                    Text: $"Correct answer: {correctOption.Text}",
                    IsCorrect: true
                ));
            }
        }
        else
        {
            if (userAnswer.AnswerDetails.Any())
            {
                foreach (var answerDetail in userAnswer.AnswerDetails)
                {
                    var optionText = answerDetail.AnswerOption?.Text ?? "[Unknown option]";
                    details.Add(new UserAnswerDetailResponse(
                        Text: $"Selected: {optionText}",
                        IsCorrect: answerDetail.AnswerOption?.IsCorrect ?? false
                    ));
                }
            }

            var correctOptions = userAnswer.Question.AnswerOptions
                .Where(ao => ao.IsCorrect)
                .ToList();

            var selectedOptionIds = userAnswer.AnswerDetails
                .Select(ad => ad.AnswerOptionId)
                .ToList();

            var correctOptionsNotSelected = correctOptions
                .Where(ao => !selectedOptionIds.Contains(ao.Id))
                .ToList();

            foreach (var correctOption in correctOptionsNotSelected)
            {
                details.Add(new UserAnswerDetailResponse(
                    Text: $"Correct: {correctOption.Text}",
                    IsCorrect: true
                ));
            }
        }

        return details;
    }

    private bool CheckAnswerCorrectness(Question question, UserAnswerRequest answerRequest)
    {
        return question.Type switch
        {
            QuestionType.FillInBlank => CheckFillInBlankCorrectness(question, answerRequest.TextAnswer),
            QuestionType.SingleChoice => CheckSingleChoiceCorrectness(question, answerRequest),
            QuestionType.MultipleChoice => CheckMultipleChoiceCorrectness(question, answerRequest),
            QuestionType.TrueFalse => CheckSingleChoiceCorrectness(question, answerRequest),
            _ => false
        };
    }

    private bool CheckFillInBlankCorrectness(Question question, string userAnswer)
    {
        if (string.IsNullOrWhiteSpace(userAnswer)) return false;

        var correctAnswer = question.AnswerOptions.FirstOrDefault(o => o.IsCorrect);
        return correctAnswer != null &&
               correctAnswer.Text.Trim().Equals(userAnswer.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    private bool CheckSingleChoiceCorrectness(Question question, UserAnswerRequest answerRequest)
    {
        var selectedIds = answerRequest.SelectedAnswerOptionIds.ToList();
        if (selectedIds.Count != 1) return false;

        var selectedOption = question.AnswerOptions.FirstOrDefault(o => o.Id == selectedIds[0]);
        return selectedOption != null && selectedOption.IsCorrect;
    }

    private bool CheckMultipleChoiceCorrectness(Question question, UserAnswerRequest answerRequest)
    {
        var correctOptions = question.AnswerOptions.Where(o => o.IsCorrect).ToList();
        var selectedOptions = answerRequest.SelectedAnswerOptionIds.ToList();

        if (correctOptions.Count != selectedOptions.Count) return false;

        var allCorrectSelected = correctOptions.All(correct => selectedOptions.Contains(correct.Id));
        var allSelectedCorrect = selectedOptions.All(selected => correctOptions.Any(correct => correct.Id == selected));

        return allCorrectSelected && allSelectedCorrect;
    }

    private async Task UpdateLeaderboard(int quizId, Guid userId, int score, DateTime achievedAt)
    {
        var existingEntry = await _unitOfWork.LeaderboardEntries.Query()
            .FirstOrDefaultAsync(le => le.QuizId == quizId && le.UserId == userId);

        if (existingEntry != null)
        {
            if (score > existingEntry.Score)
            {
                existingEntry.Score = score;
                existingEntry.AchievedAt = achievedAt;
            }
        }
        else
        {
            var newEntry = new LeaderboardEntry
            {
                QuizId = quizId,
                UserId = userId,
                Score = score,
                AchievedAt = achievedAt
            };
            await _unitOfWork.LeaderboardEntries.AddAsync(newEntry);
        }
    }
}