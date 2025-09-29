using AutoMapper;
using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Application.DTOs.Category;
using KvizHub.Application.DTOs.Question;
using KvizHub.Application.DTOs.Quiz;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public class QuizMappingProfile : Profile
{
    public QuizMappingProfile()
    {
        // Quiz -> QuizResponse
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
            src.Id, // quizId
            q.AnswerOptions.Select(o => new AnswerOptionResponse(
                o.Id,
                o.Text,
                o.IsCorrect,
                o.QuestionId
            )).ToList()
        )).ToList()
    ));

        // Category -> CategoryResponse
        CreateMap<Category, CategoryResponse>();

        // CreateQuizRequest -> Quiz
        CreateMap<CreateQuizRequest, Quiz>()
            .ForMember(dest => dest.QuizCategories, opt => opt.Ignore()) // ovo ćemo dodati u servisu
            .ForMember(dest => dest.Questions, opt => opt.Ignore())
            .ForMember(dest => dest.LeaderboardEntries, opt => opt.Ignore())
            .ForMember(dest => dest.QuizAttempts, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}