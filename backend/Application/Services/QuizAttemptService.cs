using AutoMapper;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
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
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

        if (attempt == null || attempt.FinishedAt != null) return null;

        int score = 0;
        attempt.UserAnswers.Clear();

        foreach (var uaRequest in request.Answers)
        {
            var question = attempt.Quiz.Questions.FirstOrDefault(q => q.Id == uaRequest.QuestionId);
            if (question == null) continue;

            var userAnswer = new UserAnswer
            {
                QuestionId = question.Id,
                QuizAttemptId = attempt.Id
            };

            foreach (var selectedOptionId in uaRequest.SelectedAnswerOptionIds)
            {
                var answerOption = question.AnswerOptions.FirstOrDefault(o => o.Id == selectedOptionId);
                if (answerOption == null) continue;

                if (answerOption.IsCorrect)
                    score += question.Points / uaRequest.SelectedAnswerOptionIds.Count();

                userAnswer.AnswerDetails.Add(new UserAnswerDetail
                {
                    AnswerOptionId = answerOption.Id
                });
            }

            attempt.UserAnswers.Add(userAnswer);
        }

        attempt.Score = score;
        attempt.FinishedAt = DateTime.UtcNow;

        // Dodavanje leaderboard entry
        var leaderboardEntry = new LeaderboardEntry
        {
            QuizId = attempt.QuizId,
            UserId = attempt.UserId,
            Score = attempt.Score,
            AchievedAt = attempt.FinishedAt.Value
        };
        await _unitOfWork.LeaderboardEntries.AddAsync(leaderboardEntry);

        await _unitOfWork.SaveChangesAsync();

        var loadedAttempt = await _unitOfWork.QuizAttempts.Query()
        .Include(a => a.UserAnswers)
            .ThenInclude(ua => ua.AnswerDetails)
                .ThenInclude(d => d.AnswerOption)
        .FirstOrDefaultAsync(a => a.Id == attemptId);

        return _mapper.Map<QuizAttemptResponse>(loadedAttempt);
    }

    public async Task<IEnumerable<QuizAttemptResponse>> GetUserAttemptsAsync(Guid userId)
    {
        var attempts = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return _mapper.Map<IEnumerable<QuizAttemptResponse>>(attempts);
    }

    public async Task<QuizAttemptResponse?> GetAttemptByIdAsync(int attemptId, Guid userId)
    {
        var attempt = await _unitOfWork.QuizAttempts.Query()
            .Include(a => a.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
                    .ThenInclude(ad => ad.AnswerOption)
            .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

        return attempt == null ? null : _mapper.Map<QuizAttemptResponse>(attempt);
    }
}