using AutoMapper;
using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;
using KvizHub.Domain.Entities.Users;

namespace KvizHub.Application.Mapping;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserResponse>();

        // Password se posebno heshira
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.AvatarUrl,
                opt => opt.MapFrom(src => src.Avatar != null
                ? $"/avatars/{Guid.NewGuid()}_{src.Avatar.FileName}"
                : null));
    }
}