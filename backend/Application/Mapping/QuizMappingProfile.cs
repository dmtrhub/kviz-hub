using AutoMapper;
using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Application.DTOs.Category;
using KvizHub.Application.DTOs.Question;
using KvizHub.Application.DTOs.Quiz;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public sealed class QuizMappingProfile : Profile
{
    public QuizMappingProfile()
    {
        CreateMap<Quiz, QuizResponse>()
            .ConstructUsing(src => new QuizResponse(
                src.Id,
                src.Title,
                src.Description,
                src.Difficulty.ToString(),
                src.TimeLimit,
                src.Questions.Count,
                src.QuizCategories.Select(qc => new CategoryResponse(
                    qc.Category.Id,
                    qc.Category.Name,
                    qc.Category.Description
                )),
                src.Questions.Select(q => new QuestionResponse(
                    q.Id,
                    q.Text,
                    q.Type.ToString(),
                    q.Points,
                    src.Id,
                    q.AnswerOptions.Select(o => new AnswerOptionResponse(
                        o.Id,
                        o.Text,
                        o.IsCorrect,
                        o.QuestionId
                    )).ToList()
                )).ToList()
            ));

        CreateMap<CreateQuizRequest, Quiz>()
            .ForMember(dest => dest.QuizCategories, opt => opt.Ignore())
            .ForMember(dest => dest.Questions, opt => opt.Ignore())
            .ForMember(dest => dest.LeaderboardEntries, opt => opt.Ignore())
            .ForMember(dest => dest.QuizAttempts, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}