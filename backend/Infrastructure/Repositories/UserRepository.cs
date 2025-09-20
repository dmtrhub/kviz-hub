using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Users;
using KvizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<User?> FindByUsernameOrEmailAsync(string identifier)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == identifier || u.Email == identifier);
    }

    public async Task<bool> ExistsByUsernameAsync(string username)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email);
    }
}