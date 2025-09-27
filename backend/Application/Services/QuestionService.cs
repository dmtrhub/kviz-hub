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
        var question = await _unitOfWork.Questions.GetByIdAsync(id);
        if (question == null) return false;

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