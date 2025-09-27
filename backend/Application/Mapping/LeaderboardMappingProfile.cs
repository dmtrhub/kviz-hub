using AutoMapper;
using KvizHub.Application.DTOs.LeaderboardEntry;
using KvizHub.Application.DTOs.QuizAttempt;
using KvizHub.Application.DTOs.UserAnswer;
using KvizHub.Domain.Entities.Quizzes;

namespace KvizHub.Application.Mapping;

public class LeaderboardProfile : Profile
{
    public LeaderboardProfile()
    {
        CreateMap<LeaderboardEntry, LeaderboardEntryResponse>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.QuizTitle, opt => opt.MapFrom(src => src.Quiz.Title));
    }
}