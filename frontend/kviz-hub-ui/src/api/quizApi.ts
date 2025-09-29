import axiosInstance from './axios';
import type { Quiz } from '../models/Quiz';

export const quizApi = {
  getAllQuizzes: (): Promise<Quiz[]> => 
    axiosInstance.get('/quizzes').then(res => res.data),
    
  getQuizById: (id: number): Promise<Quiz> => 
    axiosInstance.get(`/quizzes/${id}`).then(res => res.data),
    
  startQuiz: (quizId: number): Promise<any> => 
    axiosInstance.post(`/quizzes/${quizId}/attempts`).then(res => res.data),
};