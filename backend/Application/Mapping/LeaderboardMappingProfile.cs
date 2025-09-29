using AutoMapper;
using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public class LeaderboardProfile : Profile
{
    public LeaderboardProfile()
    {
        CreateMap<LeaderboardEntry, LeaderboardEntryResponse>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.MaxScore, opt => opt.MapFrom(src => src.Quiz.Questions.Sum(q => q.Points)))
            .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src =>
                src.Quiz.Questions.Sum(q => q.Points) > 0 ?
                    (int)Math.Round((src.Score / (double)src.Quiz.Questions.Sum(q => q.Points)) * 100) : 0));

    }
}