using AutoMapper;
using KvizHub.Application.DTOs.Auth;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Application.Mapping;
using KvizHub.Application.Services;
using KvizHub.Domain.Entities.Users;
using Microsoft.Extensions.Configuration;
using Moq;

namespace KvizHub.Application.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthServiceTests()
    {
        var mapperConfiguration = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<UserMappingProfile>();
        });

        _mapper = mapperConfiguration.CreateMapper();

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-secret-key-that-is-long-enough-for-signing",
                ["Jwt:Issuer"] = "https://issuer.test",
                ["Jwt:Audience"] = "https://audience.test",
                ["Jwt:ExpiryHours"] = "2"
            })
            .Build();

        _unitOfWorkMock.SetupGet(x => x.Users).Returns(_userRepositoryMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_WhenUsernameExists_ThrowsInvalidOperationException()
    {
        var request = new RegisterRequest("existing", "new@email.com", "Password123!", null);

        _userRepositoryMock.Setup(x => x.ExistsByUsernameAsync(request.Username)).ReturnsAsync(true);

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(request));
    }

    [Fact]
    public async Task RegisterAsync_WhenEmailExists_ThrowsInvalidOperationException()
    {
        var request = new RegisterRequest("new-user", "existing@email.com", "Password123!", null);

        _userRepositoryMock.Setup(x => x.ExistsByUsernameAsync(request.Username)).ReturnsAsync(false);
        _userRepositoryMock.Setup(x => x.ExistsByEmailAsync(request.Email)).ReturnsAsync(true);

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(request));
    }

    [Fact]
    public async Task RegisterAsync_WhenRequestIsValid_ReturnsTokenAndPersistsHashedPassword()
    {
        var request = new RegisterRequest("new-user", "new@email.com", "Password123!", null);
        User? persistedUser = null;

        _userRepositoryMock.Setup(x => x.ExistsByUsernameAsync(request.Username)).ReturnsAsync(false);
        _userRepositoryMock.Setup(x => x.ExistsByEmailAsync(request.Email)).ReturnsAsync(false);
        _userRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<User>()))
            .Callback<User>(user => persistedUser = user)
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync()).ReturnsAsync(1);

        var service = CreateService();

        var response = await service.RegisterAsync(request);

        Assert.NotNull(persistedUser);
        Assert.True(BCrypt.Net.BCrypt.Verify(request.Password, persistedUser!.PasswordHash));
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal(request.Username, response.User.Username);
        Assert.Equal(request.Email, response.User.Email);

        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WhenUserDoesNotExist_ThrowsUnauthorizedAccessException()
    {
        var request = new LoginRequest("unknown", "Password123!");

        _userRepositoryMock.Setup(x => x.FindByUsernameOrEmailAsync(request.Identifier)).ReturnsAsync((User?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_WhenPasswordIsInvalid_ThrowsUnauthorizedAccessException()
    {
        var request = new LoginRequest("valid-user", "wrong-password");

        _userRepositoryMock.Setup(x => x.FindByUsernameOrEmailAsync(request.Identifier)).ReturnsAsync(new User
        {
            Id = Guid.NewGuid(),
            Username = "valid-user",
            Email = "valid@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!")
        });

        var service = CreateService();

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_WhenCredentialsAreValid_ReturnsJwtResponse()
    {
        const string password = "CorrectPassword123!";
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "valid-user",
            Email = "valid@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };
        var request = new LoginRequest(user.Username, password);

        _userRepositoryMock.Setup(x => x.FindByUsernameOrEmailAsync(request.Identifier)).ReturnsAsync(user);

        var service = CreateService();

        var response = await service.LoginAsync(request);

        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal(user.Username, response.User.Username);
        Assert.Equal(user.Email, response.User.Email);
        Assert.True(response.Expiration > DateTime.UtcNow);
    }

    [Fact]
    public async Task LoginAsync_WhenIdentifierIsEmail_ReturnsJwtResponse()
    {
        const string password = "CorrectPassword123!";
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "valid-user",
            Email = "valid@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };
        var request = new LoginRequest(user.Email, password);

        _userRepositoryMock.Setup(x => x.FindByUsernameOrEmailAsync(request.Identifier)).ReturnsAsync(user);

        var service = CreateService();

        var response = await service.LoginAsync(request);

        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal(user.Username, response.User.Username);
    }

    private AuthService CreateService() => new(_unitOfWorkMock.Object, _mapper, _configuration);
}
