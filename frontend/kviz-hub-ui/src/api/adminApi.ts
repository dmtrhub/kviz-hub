import axiosInstance from './axios';
import type { Quiz, } from '../models/Quiz';
import type { Category } from '../models/Category';
import type { Question } from '../models/Question';
import type { QuizAttemptResponse } from '../models/QuizAttempt';

export const adminApi = {
  // Quizzes
  getAllQuizzes: (): Promise<Quiz[]> => 
    axiosInstance.get('/quizzes').then(res => res.data),
    
  createQuiz: (quizData: any): Promise<Quiz> => 
    axiosInstance.post('/quizzes', quizData).then(res => res.data),
    
  updateQuiz: (id: number, quizData: any): Promise<Quiz> => 
    axiosInstance.put(`/quizzes/${id}`, quizData).then(res => res.data),
    
  deleteQuiz: (id: number): Promise<void> => 
    axiosInstance.delete(`/quizzes/${id}`),

  // Categories
  getAllCategories: (): Promise<Category[]> => 
    axiosInstance.get('/categories').then(res => res.data),
    
  createCategory: (categoryData: any): Promise<Category> => 
    axiosInstance.post('/categories', categoryData).then(res => res.data),
    
  updateCategory: (id: number, categoryData: any): Promise<Category> => 
    axiosInstance.put(`/categories/${id}`, categoryData).then(res => res.data),
    
  deleteCategory: (id: number): Promise<void> => 
    axiosInstance.delete(`/categories/${id}`),

  // Questions
  getAllQuestions: (): Promise<Question[]> => 
    axiosInstance.get('/questions').then(res => res.data),
    
  getQuestionsByQuiz: (quizId: number): Promise<Question[]> => 
    axiosInstance.get(`/quizzes/${quizId}/questions`).then(res => res.data),
    
  createQuestion: (quizId: number, questionData: any): Promise<Question> => 
    axiosInstance.post(`/quizzes/${quizId}/questions`, questionData).then(res => res.data),
    
  updateQuestion: (id: number, questionData: any): Promise<Question> => 
    axiosInstance.put(`/questions/${id}`, questionData).then(res => res.data),
    
  deleteQuestion: (id: number): Promise<void> => 
    axiosInstance.delete(`/questions/${id}`),

  getAllQuizAttempts: (): Promise<QuizAttemptResponse[]> => {
    // PROVERI TOKEN
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔐 Token payload:', payload);
        console.log('🎭 User role from token:', payload.role);
        console.log('📧 User email from token:', payload.email);
      } catch (e) {
        console.error('❌ Error parsing token:', e);
      }
    } else {
      console.warn('⚠️ No token found');
    }
    
    return axiosInstance.get('/admin/quiz-attempts')
      .then(res => res.data)
      .catch(error => {
        console.error('❌ GET /admin/quiz-attempts failed:', error);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
        throw error;
      });
  },
    
  getQuizAttemptsByQuiz: (quizId: number): Promise<QuizAttemptResponse[]> => 
    axiosInstance.get(`/admin/quizzes/${quizId}/attempts`).then(res => res.data),
};