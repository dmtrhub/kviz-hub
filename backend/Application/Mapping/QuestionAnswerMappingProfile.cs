using AutoMapper;
using KvizHub.Application.DTOs.AnswerOption;
using KvizHub.Application.DTOs.Question;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public sealed class QuestionAnswerMappingProfile : Profile
{
    public QuestionAnswerMappingProfile()
    {
        CreateMap<Question, QuestionResponse>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        CreateMap<CreateQuestionRequest, Question>();

        CreateMap<UpdateQuestionRequest, Question>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Quiz, opt => opt.Ignore());

        CreateMap<AnswerOption, AnswerOptionResponse>().ReverseMap();
        CreateMap<CreateAnswerOptionRequest, AnswerOption>();
        CreateMap<UpdateAnswerOptionRequest, AnswerOption>();
    }
}