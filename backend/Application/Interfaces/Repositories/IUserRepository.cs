using KvizHub.Domain.Entities.Users;

namespace KvizHub.Application.Interfaces.Repositories;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> FindByUsernameOrEmailAsync(string identifier);

    Task<bool> ExistsByUsernameAsync(string username);

    Task<bool> ExistsByEmailAsync(string email);
}