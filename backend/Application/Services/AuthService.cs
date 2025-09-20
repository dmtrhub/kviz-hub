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
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<UserResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _userRepository.ExistsByUsernameAsync(request.Username))
            throw new Exception("Username already exists.");
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new Exception("Email already exists.");

        // Mapiranje
        var user = _mapper.Map<User>(request);

        // Hash lozinke
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<UserResponse>(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository
            .FindByUsernameOrEmailAsync(request.Identifier);

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

        var expiryHours = _configuration.GetValue<int>("Jwt:ExpiryHours");
        var expiration = DateTime.UtcNow.AddHours(expiryHours);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return new AuthResponse(tokenString, expiration);
    }
}