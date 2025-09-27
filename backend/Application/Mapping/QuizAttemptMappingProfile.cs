using AutoMapper;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping
{
    public class QuizAttemptMappingProfile : Profile
    {
        public QuizAttemptMappingProfile()
        {
            // QuizAttempt -> QuizAttemptResponse
            CreateMap<QuizAttempt, QuizAttemptResponse>()
                .ForMember(dest => dest.Answers,
                           opt => opt.MapFrom(src => src.UserAnswers));

            // UserAnswer -> UserAnswerResponse
            CreateMap<UserAnswer, UserAnswerResponse>()
                .ForMember(dest => dest.QuestionId,
                           opt => opt.MapFrom(src => src.QuestionId))
                .ForMember(dest => dest.Details,
                           opt => opt.MapFrom(src => src.AnswerDetails));

            // UserAnswerDetail -> UserAnswerDetailResponse
            CreateMap<UserAnswerDetail, UserAnswerDetailResponse>()
                .ForMember(dest => dest.AnswerOptionId,
                           opt => opt.MapFrom(src => src.AnswerOptionId))
                .ForMember(dest => dest.Text,
                           opt => opt.MapFrom(src => src.AnswerOption.Text))
                .ForMember(dest => dest.IsCorrect,
                           opt => opt.MapFrom(src => src.AnswerOption.IsCorrect));

            // Opcionalno: kreiranje DTO-a iz request-a
            CreateMap<FinishQuizAttemptRequest, QuizAttempt>();
        }
    }
}