using AutoMapper;
using KvizHub.Application.DTOs.MyResults;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;

namespace KvizHub.Application.Mapping
{
    public class QuizAttemptMappingProfile : Profile
    {
        public QuizAttemptMappingProfile()
        {
            // QuizAttempt -> QuizAttemptResponse
            CreateMap<QuizAttempt, QuizAttemptResponse>()
                .ForMember(dest => dest.TotalQuestions,
                    opt => opt.MapFrom(src => src.Quiz.Questions.Count))
                .ForMember(dest => dest.CorrectAnswers,
                    opt => opt.MapFrom(src => CalculateCorrectAnswers(src.UserAnswers)))
                .ForMember(dest => dest.Answers,
                    opt => opt.MapFrom(src => src.UserAnswers));

            // UserAnswer -> UserAnswerResponse
            CreateMap<UserAnswer, UserAnswerResponse>()
                .ForMember(dest => dest.QuestionText,
                    opt => opt.MapFrom(src => src.Question.Text))
                .ForMember(dest => dest.QuestionType,
                    opt => opt.MapFrom(src => src.Question.Type.ToString()))
                .ForMember(dest => dest.IsCorrect,
                    opt => opt.MapFrom(src => IsAnswerCorrect(src)))
                .ForMember(dest => dest.Points,
                    opt => opt.MapFrom(src => IsAnswerCorrect(src) ? src.Question.Points : 0)) 
                .ForMember(dest => dest.SelectedOptionIds, 
                    opt => opt.MapFrom(src => src.AnswerDetails.Select(ad => ad.AnswerOptionId).ToList()))
                .ForMember(dest => dest.TextAnswer,       
                    opt => opt.MapFrom(src => src.TextAnswer))
                .ForMember(dest => dest.Details,
                    opt => opt.MapFrom(src => MapAnswerDetails(src))); 

            // UserAnswerDetail -> UserAnswerDetailResponse
            CreateMap<UserAnswerDetail, UserAnswerDetailResponse>()
                .ForMember(dest => dest.Text,
                    opt => opt.MapFrom(src => src.AnswerOption.Text))
                .ForMember(dest => dest.IsCorrect,
                    opt => opt.MapFrom(src => src.AnswerOption.IsCorrect));

            CreateMap<QuizAttempt, MyQuizResultDto>()
                .ForMember(dest => dest.AttemptId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.Quiz.Id))
                .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
                .ForMember(dest => dest.Score, opt => opt.MapFrom(src => src.Score))
                .ForMember(dest => dest.MaxScore, opt => opt.MapFrom(src => src.Quiz.MaxScore))
                .ForMember(dest => dest.CorrectAnswers, opt => opt.MapFrom(src => CalculateCorrectAnswers(src.UserAnswers)))
                .ForMember(dest => dest.TotalQuestions, opt => opt.MapFrom(src => src.Quiz.Questions.Count))
                .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src =>
                    src.Quiz.Questions.Count > 0
                        ? (int)Math.Round((double)CalculateCorrectAnswers(src.UserAnswers) / src.Quiz.Questions.Count * 100)
                        : 0))
                .ForMember(dest => dest.StartedAt, opt => opt.MapFrom(src => src.StartedAt))
                .ForMember(dest => dest.FinishedAt, opt => opt.MapFrom(src => src.FinishedAt))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src =>
        src.FinishedAt.HasValue
            ? (int)(src.FinishedAt.Value - src.StartedAt).TotalMinutes
            : 0));
        }

        // Pomoćne metode za kompleksniju logiku
        private static int CalculateCorrectAnswers(ICollection<UserAnswer> userAnswers)
        {
            return userAnswers.Count(ua => IsAnswerCorrect(ua));
        }

        private static bool IsAnswerCorrect(UserAnswer userAnswer)
        {
            if (userAnswer.Question.Type == QuestionType.FillInBlank)
            {
                // Za tekstualni odgovor
                var correctAnswer = userAnswer.Question.AnswerOptions
                    .FirstOrDefault(ao => ao.IsCorrect);

                return correctAnswer != null &&
                       userAnswer.TextAnswer.Trim().Equals(correctAnswer.Text.Trim(), StringComparison.OrdinalIgnoreCase);
            }
            else
            {
                // Za choice pitanja
                var selectedOptionIds = userAnswer.AnswerDetails.Select(ad => ad.AnswerOptionId).ToList();
                var correctOptionIds = userAnswer.Question.AnswerOptions
                    .Where(ao => ao.IsCorrect)
                    .Select(ao => ao.Id)
                    .ToList();

                var incorrectOptionIds = userAnswer.Question.AnswerOptions
                    .Where(ao => !ao.IsCorrect)
                    .Select(ao => ao.Id)
                    .ToList();

                return correctOptionIds.All(id => selectedOptionIds.Contains(id)) &&
                       !incorrectOptionIds.Any(id => selectedOptionIds.Contains(id));
            }
        }

        private static List<UserAnswerDetailResponse> MapAnswerDetails(UserAnswer userAnswer)
        {
            var details = new List<UserAnswerDetailResponse>();

            if (userAnswer.Question.Type == QuestionType.FillInBlank)
            {
                // Tekstualni odgovor
                details.Add(new UserAnswerDetailResponse(
                    Text: $"Your answer: {userAnswer.TextAnswer}",
                    IsCorrect: IsAnswerCorrect(userAnswer)
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
                foreach (var answerDetail in userAnswer.AnswerDetails)
                {
                    details.Add(new UserAnswerDetailResponse(
                        Text: $"Selected: {answerDetail.AnswerOption.Text}",
                        IsCorrect: answerDetail.AnswerOption.IsCorrect
                    ));
                }

                var correctOptionsNotSelected = userAnswer.Question.AnswerOptions
                    .Where(ao => ao.IsCorrect &&
                           !userAnswer.AnswerDetails.Any(ad => ad.AnswerOptionId == ao.Id))
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
    }
}