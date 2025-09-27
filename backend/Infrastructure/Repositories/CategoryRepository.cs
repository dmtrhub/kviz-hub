using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Infrastructure.Data;

namespace KvizHub.Infrastructure.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }
}