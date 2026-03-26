using AutoMapper;
using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.Mapping;

public sealed class QuizAttemptMappingProfile : Profile
{
    public QuizAttemptMappingProfile()
    {
        CreateMap<QuizAttempt, QuizAttemptResponse>()
            .ForMember(dest => dest.TotalQuestions,
                opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.Questions.Count : 0))
            .ForMember(dest => dest.CorrectAnswers,
                opt => opt.MapFrom(src => src.UserAnswers.Count(ua => ua.IsCorrect)))
            .ForMember(dest => dest.Answers,
                opt => opt.MapFrom(src => src.UserAnswers));

        CreateMap<UserAnswer, UserAnswerResponse>()
            .ForMember(dest => dest.QuestionText,
                opt => opt.MapFrom(src => src.Question != null ? src.Question.Text : "[Unknown question]"))
            .ForMember(dest => dest.QuestionType,
                opt => opt.MapFrom(src => src.Question != null ? src.Question.Type.ToString() : "Unknown"))
            .ForMember(dest => dest.IsCorrect,
                opt => opt.MapFrom(src => src.IsCorrect))
            .ForMember(dest => dest.Points,
                opt => opt.MapFrom(src => src.IsCorrect && src.Question != null ? src.Question.Points : 0))
            .ForMember(dest => dest.SelectedOptionIds,
                opt => opt.MapFrom(src => src.AnswerDetails.Select(ad => ad.AnswerOptionId).ToList()))
            .ForMember(dest => dest.TextAnswer,
                opt => opt.MapFrom(src => src.TextAnswer ?? string.Empty))
            .ForMember(dest => dest.Details,
                opt => opt.MapFrom(src => MapDetails(src)));

        CreateMap<UserAnswerDetail, UserAnswerDetailResponse>()
            .ForMember(dest => dest.Text,
                opt => opt.MapFrom(src => src.AnswerOption != null ? src.AnswerOption.Text : "[Unknown option]"))
            .ForMember(dest => dest.IsCorrect,
                opt => opt.MapFrom(src => src.AnswerOption != null && src.AnswerOption.IsCorrect));

        CreateMap<QuizAttempt, MyQuizResultDto>()
            .ForMember(dest => dest.AttemptId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
            .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.Title : "[Unknown Quiz]"))
            .ForMember(dest => dest.Score, opt => opt.MapFrom(src => src.Score))
            .ForMember(dest => dest.MaxScore, opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.MaxScore : 0))
            .ForMember(dest => dest.CorrectAnswers, opt => opt.MapFrom(src => src.UserAnswers.Count(ua => ua.IsCorrect)))
            .ForMember(dest => dest.TotalQuestions, opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.Questions.Count : 0))
            .ForMember(dest => dest.Percentage,
                opt => opt.MapFrom(src =>
                    src.Quiz == null || src.Quiz.Questions.Count == 0
                        ? 0
                        : (int)Math.Round((double)src.UserAnswers.Count(ua => ua.IsCorrect) / src.Quiz.Questions.Count * 100)))
            .ForMember(dest => dest.StartedAt, opt => opt.MapFrom(src => src.StartedAt))
            .ForMember(dest => dest.FinishedAt, opt => opt.MapFrom(src => src.FinishedAt ?? src.StartedAt))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src =>
                src.FinishedAt.HasValue
                    ? (int)(src.FinishedAt.Value - src.StartedAt).TotalMinutes
                    : 0));
    }

    private static List<UserAnswerDetailResponse> MapDetails(UserAnswer ua)
    {
        var details = new List<UserAnswerDetailResponse>(ua.AnswerDetails.Count + 2);

        if (ua.Question == null)
        {
            return details;
        }

        if (ua.Question.Type == QuestionType.FillInBlank)
        {
            var correct = ua.Question.AnswerOptions.FirstOrDefault(o => o.IsCorrect)?.Text;

            details.Add(new UserAnswerDetailResponse(
                Text: $"Your answer: {(string.IsNullOrWhiteSpace(ua.TextAnswer) ? "[No answer]" : ua.TextAnswer)}",
                IsCorrect: ua.IsCorrect));

            if (!string.IsNullOrWhiteSpace(correct))
            {
                details.Add(new UserAnswerDetailResponse(
                    Text: $"Correct answer: {correct}",
                    IsCorrect: true));
            }

            return details;
        }

        foreach (var detail in ua.AnswerDetails)
        {
            details.Add(new UserAnswerDetailResponse(
                Text: $"Selected: {detail.AnswerOption?.Text ?? "[Unknown option]"}",
                IsCorrect: detail.AnswerOption?.IsCorrect ?? false));
        }

        var selectedOptionIds = ua.AnswerDetails.Select(ad => ad.AnswerOptionId).ToHashSet();
        var missedCorrect = ua.Question.AnswerOptions
            .Where(o => o.IsCorrect && !selectedOptionIds.Contains(o.Id));

        foreach (var correctOption in missedCorrect)
        {
            details.Add(new UserAnswerDetailResponse(
                Text: $"Correct: {correctOption.Text}",
                IsCorrect: true));
        }

        return details;
    }
}
