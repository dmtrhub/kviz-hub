import axiosInstance from './axios';
import type { QuizAttemptResponse, SubmitQuizRequest } from '../models/QuizAttempt';

export const quizAttemptApi = {
  getAttemptById: (attemptId: number): Promise<QuizAttemptResponse> => 
    axiosInstance.get(`/attempts/${attemptId}`).then(res => res.data),
    
  finishAttempt: (attemptId: number, request: SubmitQuizRequest): Promise<QuizAttemptResponse> => 
    axiosInstance.put(`/attempts/${attemptId}/finish`, request).then(res => res.data),
    
  getMyResults: (): Promise<any[]> => 
    axiosInstance.get('/my-results').then(res => res.data),
    
  getMyProgress: (): Promise<any[]> => 
    axiosInstance.get('/my-progress').then(res => res.data),
};