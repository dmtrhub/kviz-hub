using AutoMapper;
using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;
using KvizHub.Application.Extensions;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KvizHub.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _unitOfWork.Users.ExistsByUsernameAsync(request.Username))
            throw new Exception("Username already exists.");
        if (await _unitOfWork.Users.ExistsByEmailAsync(request.Email))
            throw new Exception("Email already exists.");

        // Mapiranje
        var user = _mapper.Map<User>(request);

        // Hash lozinke
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Upload avatara (ako postoji)
        if (request.Avatar != null)
        {
            var fileName = $"{Guid.NewGuid()}_{request.Avatar.FileName}";
            var filePath = Path.Combine("wwwroot", "avatars", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.Avatar.CopyToAsync(stream);
            }

            user.AvatarUrl = $"/avatars/{fileName}";
        }

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return GenerateJwtToken(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _unitOfWork.Users.FindByUsernameOrEmailAsync(request.Identifier);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid credentials.");

        return GenerateJwtToken(user);
    }

    private AuthResponse GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? throw new Exception("JWT Key not configured.")));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var expiration = DateTime.UtcNow.AddHours(_configuration.GetValue<int>("Jwt:ExpiryHours"));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        var userResponse = _mapper.Map<UserResponse>(user);

        return new AuthResponse(tokenString, expiration, userResponse);
    }
}