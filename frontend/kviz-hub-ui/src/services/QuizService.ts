import { quizApi } from '../api/quizApi';
import { quizAttemptApi } from '../api/quizAttemptApi';
import { leaderboardApi } from '../api/leaderboardApi';
import { adminApi } from '../api/adminApi';
import type { LeaderboardFilter, LeaderboardResponse } from '../models/Leaderboard';
import type { Quiz } from '../models/Quiz';
import type { Category } from '../models/Category';
import type { Question } from '../models/Question';
import type { QuizAttemptResponse } from '../models/QuizAttempt';

export class QuizService {
  // Public methods (for regular users)
  async getAllQuizzes() {
    return await quizApi.getAllQuizzes();
  }
  
  async getQuizById(id: number) {
    return await quizApi.getQuizById(id);
  }
  
  async startQuiz(quizId: number) {
    return await quizApi.startQuiz(quizId);
  }
  
  async submitQuiz(attemptId: number, answers: any) {
    return await quizAttemptApi.finishAttempt(attemptId, { answers });
  }
  
  async getQuizResults(attemptId: number) {
    return await quizAttemptApi.getAttemptById(attemptId);
  }
  
  async getMyResults() {
    return await quizAttemptApi.getMyResults();
  }
  
  async getMyProgress() {
    return await quizAttemptApi.getMyProgress();
  }

  async getLeaderboard(filters?: LeaderboardFilter): Promise<LeaderboardResponse> {
    return await leaderboardApi.getLeaderboard(filters);
  }

  async getMyRank(filters?: LeaderboardFilter): Promise<LeaderboardResponse> {
    return await leaderboardApi.getMyRank(filters);
  }

  // Admin methods - Quizzes
  async adminGetAllQuizzes(): Promise<Quiz[]> {
    return await adminApi.getAllQuizzes();
  }
  
  async adminCreateQuiz(quizData: any): Promise<Quiz> {
    return await adminApi.createQuiz(quizData);
  }
  
  async adminUpdateQuiz(id: number, quizData: any): Promise<Quiz> {
    return await adminApi.updateQuiz(id, quizData);
  }
  
  async adminDeleteQuiz(id: number): Promise<void> {
    return await adminApi.deleteQuiz(id);
  }

  // Admin methods - Categories
  async adminGetAllCategories(): Promise<Category[]> {
    return await adminApi.getAllCategories();
  }
  
  async adminCreateCategory(categoryData: any): Promise<Category> {
    return await adminApi.createCategory(categoryData);
  }
  
  async adminUpdateCategory(id: number, categoryData: any): Promise<Category> {
    return await adminApi.updateCategory(id, categoryData);
  }
  
  async adminDeleteCategory(id: number): Promise<void> {
    return await adminApi.deleteCategory(id);
  }

  // Admin methods - Questions
  async adminGetAllQuestions(): Promise<Question[]> {
    return await adminApi.getAllQuestions();
  }
  
  async adminGetQuestionsByQuiz(quizId: number): Promise<Question[]> {
    return await adminApi.getQuestionsByQuiz(quizId);
  }
  
  async adminCreateQuestion(quizId: number, questionData: any): Promise<Question> {
    return await adminApi.createQuestion(quizId, questionData);
  }
  
  async adminUpdateQuestion(id: number, questionData: any): Promise<Question> {
    return await adminApi.updateQuestion(id, questionData);
  }
  
  async adminDeleteQuestion(id: number): Promise<void> {
    return await adminApi.deleteQuestion(id);
  }

  // Admin methods - Results/Attempts
  async adminGetAllQuizAttempts(): Promise<QuizAttemptResponse[]> {
    console.log('👑 adminGetAllQuizAttempts called in QuizService');
    return await adminApi.getAllQuizAttempts();
  }
  
  async adminGetQuizAttemptsByQuiz(quizId: number): Promise<QuizAttemptResponse[]> {
    console.log('👑 adminGetQuizAttemptsByQuiz called in QuizService');
    return await adminApi.getQuizAttemptsByQuiz(quizId);
  }
}

export const quizService = new QuizService();