import axiosInstance from './axios';
import type { PaginatedQuizzesResponse, Quiz, QuizQueryParams } from '../models/Quiz';
import type { QuizAttemptResponse } from '../models/QuizAttempt';

export const quizApi = {
  getAllQuizzes: (): Promise<Quiz[]> => 
    axiosInstance.get('/quizzes').then(res => res.data),

  getPagedQuizzes: (params: QuizQueryParams): Promise<PaginatedQuizzesResponse> =>
    axiosInstance
      .get<Quiz[]>('/quizzes', { params })
      .then(res => {
        const rawPagination = res.headers['x-pagination'];

        const fallbackPagination = {
          totalCount: res.data.length,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: 1
        };

        const parsedPagination = typeof rawPagination === 'string'
          ? JSON.parse(rawPagination)
          : fallbackPagination;

        return {
          items: res.data,
          pagination: {
            totalCount: parsedPagination.totalCount ?? fallbackPagination.totalCount,
            page: parsedPagination.page ?? fallbackPagination.page,
            pageSize: parsedPagination.pageSize ?? fallbackPagination.pageSize,
            totalPages: parsedPagination.totalPages ?? fallbackPagination.totalPages
          }
        };
      }),
    
  getQuizById: (id: number): Promise<Quiz> => 
    axiosInstance.get(`/quizzes/${id}`).then(res => res.data),
    
  startQuiz: (quizId: number): Promise<QuizAttemptResponse> => 
    axiosInstance.post(`/quizzes/${quizId}/attempts`).then(res => res.data),
};