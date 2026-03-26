using AutoMapper;
using KvizHub.Application.DTOs.Question;
using KvizHub.Application.Exceptions;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace KvizHub.Application.Services;

public sealed class QuestionService(IUnitOfWork unitOfWork, IMapper mapper) : IQuestionService
{
    public async Task<QuestionResponse> CreateQuestionAsync(int quizId, CreateQuestionRequest request)
    {
        var question = mapper.Map<Question>(request);
        question.QuizId = quizId;

        await unitOfWork.Questions.AddAsync(question);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<QuestionResponse>(question);
    }

    public async Task<bool> DeleteQuestionAsync(int id)
    {
        var question = await unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .Include(q => q.UserAnswers)
                .ThenInclude(ua => ua.AnswerDetails)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null) return false;

        // Brišemo sve povezane entitete u jednom prolazu
        if (question.UserAnswers?.Any() == true)
        {
            var allUserAnswerDetails = question.UserAnswers
                .SelectMany(ua => ua.AnswerDetails)
                .ToList();

            if (allUserAnswerDetails.Any())
                unitOfWork.UserAnswerDetails.RemoveRange(allUserAnswerDetails);

            unitOfWork.UserAnswers.RemoveRange(question.UserAnswers);
        }

        if (question.AnswerOptions?.Any() == true)
            unitOfWork.AnswerOptions.RemoveRange(question.AnswerOptions);

        unitOfWork.Questions.Remove(question);
        await unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<QuestionResponse?> GetByIdAsync(int id)
    {
        var question = await unitOfWork.Questions.Query()
            .AsNoTracking()
            .Include(q => q.AnswerOptions)
            .FirstOrDefaultAsync(q => q.Id == id);

        return question == null ? null : mapper.Map<QuestionResponse>(question);
    }

    public async Task<IEnumerable<QuestionResponse>> GetByQuizIdAsync(int quizId)
    {
        return await GetQuestionsInternal(q => q.QuizId == quizId);
    }

    public async Task<IEnumerable<QuestionResponse>> GetQuestionsAsync()
    {
        return await GetQuestionsInternal();
    }

    public async Task<QuestionResponse?> UpdateQuestionAsync(int id, UpdateQuestionRequest request)
    {
        var question = await unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null) return null;

        // --- Update osnovnih polja ---
        question.Text = request.Text;
        if (!Enum.TryParse<QuestionType>(request.Type, ignoreCase: true, out var parsedType))
        {
            throw new BadRequestException("Invalid question type.");
        }

        question.Type = parsedType;
        question.Points = request.Points;

        // Promena QuizId
        if (question.QuizId != request.QuizId)
        {
            question.QuizId = request.QuizId;
        }

        // --- Update AnswerOptions ---
        // Ako request ne sadrži id-eve, tretiramo ih sve kao nove
        question.AnswerOptions.Clear(); // obriši stare
        foreach (var opt in request.AnswerOptions)
        {
            question.AnswerOptions.Add(new AnswerOption
            {
                Text = opt.Text,
                IsCorrect = opt.IsCorrect
            });
        }

        unitOfWork.Questions.Update(question);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<QuestionResponse>(question);
    }

    // --- Private helper for DRY ---
    private async Task<IEnumerable<QuestionResponse>> GetQuestionsInternal(Expression<Func<Question, bool>>? predicate = null)
    {
        IQueryable<Question> query = unitOfWork.Questions.Query()
            .AsNoTracking()
            .Include(q => q.AnswerOptions);

        if (predicate != null)
            query = query.Where(predicate);

        var questions = await query.ToListAsync();
        return mapper.Map<IEnumerable<QuestionResponse>>(questions);
    }
}