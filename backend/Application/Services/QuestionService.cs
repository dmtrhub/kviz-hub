using AutoMapper;
using KvizHub.Application.DTOs.Question;
using KvizHub.Application.Interfaces;
using KvizHub.Application.Interfaces.Repositories;
using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Application.Services;

public class QuestionService : IQuestionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public QuestionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<QuestionResponse> CreateQuestionAsync(int quizId, CreateQuestionRequest request)
    {
        var question = _mapper.Map<Question>(request);
        question.QuizId = quizId;

        await _unitOfWork.Questions.AddAsync(question);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<QuestionResponse>(question);
    }

    public async Task<bool> DeleteQuestionAsync(int id)
    {
        var question = await _unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .Include(q => q.UserAnswers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null) return false;

        var answerOptionIds = question.AnswerOptions.Select(ao => ao.Id).ToList();
        var userAnswerDetailsForOptions = await _unitOfWork.UserAnswerDetails.Query()
            .Where(uad => answerOptionIds.Contains(uad.AnswerOptionId))
            .ToListAsync();

        if (userAnswerDetailsForOptions.Any())
        {
            _unitOfWork.UserAnswerDetails.RemoveRange(userAnswerDetailsForOptions);
        }

        var userAnswerIds = question.UserAnswers?.Select(ua => ua.Id).ToList() ?? new List<int>();
        var userAnswerDetailsForUserAnswers = await _unitOfWork.UserAnswerDetails.Query()
            .Where(uad => userAnswerIds.Contains(uad.UserAnswerId))
            .ToListAsync();

        if (userAnswerDetailsForUserAnswers.Any())
        {
            _unitOfWork.UserAnswerDetails.RemoveRange(userAnswerDetailsForUserAnswers);
        }

        if (question.UserAnswers?.Any() == true)
        {
            _unitOfWork.UserAnswers.RemoveRange(question.UserAnswers);
        }

        _unitOfWork.AnswerOptions.RemoveRange(question.AnswerOptions);

        _unitOfWork.Questions.Remove(question);

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<QuestionResponse?> GetByIdAsync(int id)
    {
        var question = await _unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .FirstOrDefaultAsync(q => q.Id == id);

        return question == null ? null : _mapper.Map<QuestionResponse>(question);
    }

    public async Task<IEnumerable<QuestionResponse>> GetByQuizIdAsync(int quizId)
    {
        var questions = await _unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .Where(q => q.QuizId == quizId)
            .ToListAsync();

        return _mapper.Map<IEnumerable<QuestionResponse>>(questions);
    }

    public async Task<IEnumerable<QuestionResponse>> GetQuestionsAsync()
    {
        var questions = await _unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .ToListAsync();

        return _mapper.Map<IEnumerable<QuestionResponse>>(questions);
    }

    public async Task<QuestionResponse?> UpdateQuestionAsync(int id, UpdateQuestionRequest request)
    {
        var question = await _unitOfWork.Questions.Query()
            .Include(q => q.AnswerOptions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null) return null;

        _mapper.Map(request, question);

        _unitOfWork.Questions.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<QuestionResponse>(question);
    }
}