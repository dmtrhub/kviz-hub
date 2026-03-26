using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Users;
using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Repositories;

public class UserRepository(ApplicationDbContext context) : GenericRepository<User>(context), IUserRepository
{
    public async Task<User?> FindByUsernameOrEmailAsync(string identifier)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Username == identifier || u.Email == identifier);
    }

    public async Task<bool> ExistsByUsernameAsync(string username)
    {
        return await _dbSet.AnyAsync(u => u.Username == username);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }
}