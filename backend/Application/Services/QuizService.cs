using AutoMapper;
using KvizHub.Application.DTOs.Quiz;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public class QuizService : IQuizService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public QuizService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<QuizResponse>> GetQuizzesAsync(QuizFilterRequest filter)
    {
        var query = _unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
                .ThenInclude(qc => qc.Category)
            .Include(q => q.Questions)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Keyword))
            query = query.Where(q => q.Title.Contains(filter.Keyword) || q.Description.Contains(filter.Keyword));

        if (filter.CategoryId.HasValue)
            query = query.Where(q => q.QuizCategories.Any(qc => qc.CategoryId == filter.CategoryId.Value));

        if (filter.Difficulty.HasValue)
            query = query.Where(q => q.Difficulty == filter.Difficulty.Value);

        var quizzes = await query.ToListAsync();
        return _mapper.Map<IEnumerable<QuizResponse>>(quizzes);
    }

    public async Task<QuizResponse?> GetQuizByIdAsync(int id)
    {
        var quiz = await _unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
                .ThenInclude(qc => qc.Category)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
            return null;

        return _mapper.Map<QuizResponse>(quiz);
    }

    public async Task<QuizResponse> CreateQuizAsync(CreateQuizRequest request)
    {
        var quiz = _mapper.Map<Quiz>(request);

        if (request.CategoryIds != null && request.CategoryIds.Any())
        {
            quiz.QuizCategories = request.CategoryIds
                .Select(cid => new QuizCategory { CategoryId = cid, Quiz = quiz })
                .ToList();
        }

        await _unitOfWork.Quizzes.AddAsync(quiz);
        await _unitOfWork.SaveChangesAsync();

        // Ponovo učitaj kviz sa uključivanjima za response
        quiz = await _unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
                .ThenInclude(qc => qc.Category)
            .Include(q => q.Questions)
            .FirstAsync(q => q.Id == quiz.Id);

        return _mapper.Map<QuizResponse>(quiz);
    }

    public async Task<QuizResponse?> UpdateQuizAsync(int id, UpdateQuizRequest request)
    {
        var quiz = await _unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
            return null;

        quiz.Title = request.Title;
        quiz.Description = request.Description;
        quiz.Difficulty = request.Difficulty;
        quiz.TimeLimit = request.TimeLimit;

        // Update categories
        if (request.CategoryIds != null)
        {
            // Remove old categories not in the new list
            quiz.QuizCategories.ToList().RemoveAll(qc => !request.CategoryIds.Contains(qc.CategoryId));

            // Add new categories
            var existingCategoryIds = quiz.QuizCategories.Select(qc => qc.CategoryId).ToList();
            var toAdd = request.CategoryIds.Except(existingCategoryIds)
                .Select(cid => new QuizCategory { CategoryId = cid, QuizId = quiz.Id });

            quiz.QuizCategories.ToList().AddRange(toAdd);
        }

        _unitOfWork.Quizzes.Update(quiz);
        await _unitOfWork.SaveChangesAsync();

        quiz = await _unitOfWork.Quizzes.Query()
            .Include(q => q.QuizCategories)
                .ThenInclude(qc => qc.Category)
            .Include(q => q.Questions)
            .FirstAsync(q => q.Id == quiz.Id);

        return _mapper.Map<QuizResponse>(quiz);
    }

    public async Task<bool> DeleteQuizAsync(int id)
    {
        var quiz = await _unitOfWork.Quizzes.GetByIdAsync(id);
        if (quiz == null)
            return false;

        _unitOfWork.Quizzes.Remove(quiz);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}