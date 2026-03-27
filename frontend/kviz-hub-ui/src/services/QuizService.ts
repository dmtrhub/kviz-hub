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
    return quizApi.getAllQuizzes();
  }
  
  async getQuizById(id: number) {
    return quizApi.getQuizById(id);
  }
  
  async startQuiz(quizId: number) {
    return quizApi.startQuiz(quizId);
  }
  
  async submitQuiz(attemptId: number, answers: any) {
    return quizAttemptApi.finishAttempt(attemptId, { answers });
  }
  
  async getQuizResults(attemptId: number) {
    return quizAttemptApi.getAttemptById(attemptId);
  }
  
  async getMyResults() {
    return quizAttemptApi.getMyResults();
  }
  
  async getMyProgress() {
    return quizAttemptApi.getMyProgress();
  }

  async getLeaderboard(filters?: LeaderboardFilter): Promise<LeaderboardResponse> {
    return leaderboardApi.getLeaderboard(filters);
  }

  async getMyRank(filters?: LeaderboardFilter): Promise<LeaderboardResponse> {
    return leaderboardApi.getMyRank(filters);
  }

  // Admin methods - Quizzes
  async adminGetAllQuizzes(): Promise<Quiz[]> {
    return adminApi.getAllQuizzes();
  }
  
  async adminCreateQuiz(quizData: any): Promise<Quiz> {
    return adminApi.createQuiz(quizData);
  }
  
  async adminUpdateQuiz(id: number, quizData: any): Promise<Quiz> {
    return adminApi.updateQuiz(id, quizData);
  }
  
  async adminDeleteQuiz(id: number): Promise<void> {
    return adminApi.deleteQuiz(id);
  }

  // Admin methods - Categories
  async adminGetAllCategories(): Promise<Category[]> {
    return adminApi.getAllCategories();
  }
  
  async adminCreateCategory(categoryData: any): Promise<Category> {
    return adminApi.createCategory(categoryData);
  }
  
  async adminUpdateCategory(id: number, categoryData: any): Promise<Category> {
    return adminApi.updateCategory(id, categoryData);
  }
  
  async adminDeleteCategory(id: number): Promise<void> {
    return adminApi.deleteCategory(id);
  }

  // Admin methods - Questions
  async adminGetAllQuestions(): Promise<Question[]> {
    return adminApi.getAllQuestions();
  }
  
  async adminGetQuestionsByQuiz(quizId: number): Promise<Question[]> {
    return adminApi.getQuestionsByQuiz(quizId);
  }
  
  async adminCreateQuestion(quizId: number, questionData: any): Promise<Question> {
    return adminApi.createQuestion(quizId, questionData);
  }
  
  async adminUpdateQuestion(id: number, questionData: any): Promise<Question> {
    return adminApi.updateQuestion(id, questionData);
  }
  
  async adminDeleteQuestion(id: number): Promise<void> {
    return adminApi.deleteQuestion(id);
  }

  // Admin methods - Results/Attempts
  async adminGetAllQuizAttempts(): Promise<QuizAttemptResponse[]> {
    return adminApi.getAllQuizAttempts();
  }
  
  async adminGetQuizAttemptsByQuiz(quizId: number): Promise<QuizAttemptResponse[]> {
    return adminApi.getQuizAttemptsByQuiz(quizId);
  }
}

export const quizService = new QuizService();