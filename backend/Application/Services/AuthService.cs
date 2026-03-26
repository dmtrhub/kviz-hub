using AutoMapper;
using KvizHub.Application.DTOs;
using KvizHub.Application.DTOs.Auth;
using KvizHub.Application.Exceptions;
using KvizHub.Application.Extensions;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KvizHub.Application.Services;

public class AuthService(
    IUnitOfWork unitOfWork,
    IMapper mapper,
    IConfiguration configuration) : IAuthService
{
    private const long MaxAvatarSizeBytes = 2 * 1024 * 1024;
    private static readonly HashSet<string> AllowedAvatarExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp"
    };

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // --- VALIDACIJE ---
        if (await unitOfWork.Users.ExistsByUsernameAsync(request.Username))
            throw new InvalidOperationException("Username already exists.");

        if (await unitOfWork.Users.ExistsByEmailAsync(request.Email))
            throw new InvalidOperationException("Email already exists.");

        // --- MAPIRANJE USERA ---
        var user = mapper.Map<User>(request);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // --- AVATAR UPLOAD ---
        if (request.Avatar is not null)
        {
            user.AvatarUrl = await SaveAvatarAsync(request.Avatar);
        }

        // --- SAVE USER ---
        await unitOfWork.Users.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return GenerateJwtToken(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await unitOfWork.Users.FindByUsernameOrEmailAsync(request.Identifier);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return GenerateJwtToken(user);
    }

    // -----------------------
    //  PRIVATE HELPERS
    // -----------------------

    private async Task<string> SaveAvatarAsync(IFormFile avatar)
    {
        await ValidateAvatarAsync(avatar);

        var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{extension}";
        var directory = Path.Combine("wwwroot", "avatars");
        var filePath = Path.Combine(directory, fileName);

        Directory.CreateDirectory(directory);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await avatar.CopyToAsync(stream);

        return $"/avatars/{fileName}";
    }

    private static async Task ValidateAvatarAsync(IFormFile avatar)
    {
        if (avatar.Length <= 0)
            throw new BadRequestException("Avatar file is empty.");

        if (avatar.Length > MaxAvatarSizeBytes)
            throw new BadRequestException("Avatar must be less than 2MB.");

        var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(extension) || !AllowedAvatarExtensions.Contains(extension))
            throw new BadRequestException("Unsupported avatar file extension.");

        await using var stream = avatar.OpenReadStream();
        var header = new byte[12];
        var bytesRead = await stream.ReadAsync(header);

        if (!HasValidImageSignature(header, bytesRead, extension))
            throw new BadRequestException("Avatar content does not match the declared image type.");
    }

    private static bool HasValidImageSignature(byte[] header, int bytesRead, string extension)
    {
        return extension switch
        {
            ".jpg" or ".jpeg" => bytesRead >= 3
                && header[0] == 0xFF
                && header[1] == 0xD8
                && header[2] == 0xFF,
            ".png" => bytesRead >= 8
                && header[0] == 0x89
                && header[1] == 0x50
                && header[2] == 0x4E
                && header[3] == 0x47
                && header[4] == 0x0D
                && header[5] == 0x0A
                && header[6] == 0x1A
                && header[7] == 0x0A,
            ".gif" => bytesRead >= 6
                && header[0] == 0x47
                && header[1] == 0x49
                && header[2] == 0x46
                && header[3] == 0x38
                && (header[4] == 0x37 || header[4] == 0x39)
                && header[5] == 0x61,
            ".webp" => bytesRead >= 12
                && header[0] == 0x52
                && header[1] == 0x49
                && header[2] == 0x46
                && header[3] == 0x46
                && header[8] == 0x57
                && header[9] == 0x45
                && header[10] == 0x42
                && header[11] == 0x50,
            _ => false
        };
    }

    private AuthResponse GenerateJwtToken(User user)
    {
        var jwtSection = configuration.GetSection("Jwt")
            ?? throw new Exception("Jwt section is missing in configuration");

        var keyString = jwtSection["Key"]
            ?? throw new Exception("Jwt:Key is missing.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiryHours = jwtSection.GetValue("ExpiryHours", 2);
        var expiration = DateTime.UtcNow.AddHours(expiryHours);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        var userResponse = mapper.Map<UserResponse>(user);

        return new AuthResponse(tokenString, expiration, userResponse);
    }
}