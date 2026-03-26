using AutoMapper;
using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public sealed class LeaderboardProfile : Profile
{
    public LeaderboardProfile()
    {
        CreateMap<LeaderboardEntry, LeaderboardEntryResponse>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId.ToString()))
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User != null ? src.User.Username : string.Empty))
            .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.Title : "[Unknown Quiz]"))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.MaxScore, opt => opt.MapFrom(src =>
                src.Quiz != null ? src.Quiz.Questions.Sum(q => q.Points) : 0))
            .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src =>
                src.Quiz != null && src.Quiz.Questions.Sum(q => q.Points) > 0
                    ? (int)Math.Round((src.Score / (double)src.Quiz.Questions.Sum(q => q.Points)) * 100)
                    : 0))
            .ForMember(dest => dest.Position, opt => opt.Ignore());
    }
}