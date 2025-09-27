using AutoMapper;
using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Application.DTOs.Question;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public class QuestionAnswerMappingProfile : Profile
{
    public QuestionAnswerMappingProfile()
    {
        // Question
        CreateMap<Question, QuestionResponse>().ReverseMap();
        CreateMap<CreateQuestionRequest, Question>();
        CreateMap<UpdateQuestionRequest, Question>();

        // AnswerOption
        CreateMap<AnswerOption, AnswerOptionResponse>().ReverseMap();
        CreateMap<CreateAnswerOptionRequest, AnswerOption>();
        CreateMap<UpdateAnswerOptionRequest, AnswerOption>();
    }
}