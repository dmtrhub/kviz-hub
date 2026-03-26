using AutoMapper;
using KvizHub.Application.DTOs.Quiz;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public sealed class QuizService(IUnitOfWork unitOfWork, IMapper mapper) : IQuizService
{
    public async Task<PaginatedQuizResult> GetQuizzesAsync(QuizFilterRequest? filter = null)
    {
        filter ??= new QuizFilterRequest();

        var countQuery = ApplyFilters(unitOfWork.Quizzes.Query().AsNoTracking(), filter);
        var totalCount = await countQuery.CountAsync();

        var query = ApplyFilters(GetQuizQuery(asNoTracking: true), filter);

        var usePagination = filter.Page.HasValue && filter.PageSize.HasValue
            && filter.Page.Value > 0 && filter.PageSize.Value > 0;

        var page = usePagination ? Math.Max(1, filter.Page!.Value) : 1;
        var pageSize = usePagination ? Math.Clamp(filter.PageSize!.Value, 1, 100) : Math.Max(1, totalCount);

        query = query.OrderBy(q => q.Id);

        if (usePagination)
        {
            query = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
        }

        var quizzes = await query.ToListAsync();
        var items = mapper.Map<List<QuizResponse>>(quizzes);

        return new PaginatedQuizResult(
            Items: items,
            TotalCount: totalCount,
            Page: page,
            PageSize: pageSize
        );
    }

    public async Task<QuizResponse?> GetQuizByIdAsync(int id)
    {
        var quiz = await GetQuizQuery(asNoTracking: true)
            .FirstOrDefaultAsync(q => q.Id == id);

        return quiz == null ? null : mapper.Map<QuizResponse>(quiz);
    }

    public async Task<QuizResponse> CreateQuizAsync(CreateQuizRequest request)
    {
        var quiz = mapper.Map<Quiz>(request);

        if (request.CategoryIds?.Any() == true)
        {
            var distinctCategoryIds = request.CategoryIds.Distinct();

            quiz.QuizCategories = distinctCategoryIds
                .Select(cid => new QuizCategory { CategoryId = cid, Quiz = quiz })
                .ToList();
        }

        await unitOfWork.Quizzes.AddAsync(quiz);
        await unitOfWork.SaveChangesAsync();

        var createdQuiz = await GetQuizQuery(asNoTracking: true)
            .FirstAsync(q => q.Id == quiz.Id);

        return mapper.Map<QuizResponse>(createdQuiz);
    }

    public async Task<QuizResponse?> UpdateQuizAsync(int id, UpdateQuizRequest request)
    {
        var quiz = await unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null) return null;

        quiz.Title = request.Title;
        quiz.Description = request.Description;
        quiz.Difficulty = request.Difficulty;
        quiz.TimeLimit = request.TimeLimit;

        if (request.CategoryIds != null)
        {
            var newCategoryIds = request.CategoryIds.Distinct().ToHashSet();
            var currentCategoryIds = quiz.QuizCategories.Select(qc => qc.CategoryId).ToHashSet();

            var categoriesToRemove = quiz.QuizCategories
                .Where(qc => !newCategoryIds.Contains(qc.CategoryId))
                .ToList();

            if (categoriesToRemove.Count > 0)
            {
                unitOfWork.QuizCategories.RemoveRange(categoriesToRemove);
            }

            var categoryIdsToAdd = newCategoryIds.Except(currentCategoryIds);
            foreach (var categoryId in categoryIdsToAdd)
            {
                quiz.QuizCategories.Add(new QuizCategory
                {
                    QuizId = quiz.Id,
                    CategoryId = categoryId
                });
            }
        }

        await unitOfWork.SaveChangesAsync();

        var updatedQuiz = await GetQuizQuery(asNoTracking: true)
            .FirstAsync(q => q.Id == quiz.Id);

        return mapper.Map<QuizResponse>(updatedQuiz);
    }

    public async Task<bool> DeleteQuizAsync(int id)
    {
        var quiz = await unitOfWork.Quizzes.GetByIdAsync(id);
        if (quiz == null) return false;

        unitOfWork.Quizzes.Remove(quiz);
        await unitOfWork.SaveChangesAsync();
        return true;
    }

    // --- Private helpers ---
    private IQueryable<Quiz> GetQuizQuery(bool asNoTracking)
    {
        var query = unitOfWork.Quizzes.Query()
            .Include(q => q.Questions)
                .ThenInclude(q => q.AnswerOptions)
            .Include(q => q.QuizCategories)
                .ThenInclude(qc => qc.Category);

        return asNoTracking ? query.AsNoTracking() : query;
    }

    private static IQueryable<Quiz> ApplyFilters(IQueryable<Quiz> query, QuizFilterRequest filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Keyword))
        {
            var keyword = filter.Keyword.Trim();
            query = query.Where(q => q.Title.Contains(keyword) || q.Description.Contains(keyword));
        }

        if (filter.CategoryId.HasValue)
        {
            query = query.Where(q => q.QuizCategories.Any(qc => qc.CategoryId == filter.CategoryId.Value));
        }

        if (filter.Difficulty.HasValue)
        {
            query = query.Where(q => q.Difficulty == filter.Difficulty.Value);
        }

        return query;
    }
}