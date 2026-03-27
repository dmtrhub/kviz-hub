import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { Quiz } from '../models/Quiz';
import type { Category } from '../models/Category';
import { useAsyncStatus } from './useAsyncStatus';

export const useAdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });

  const fetchQuizzes = async () => {
    const data = await execute(
      async () => {
        const [quizData, categoryData] = await Promise.all([
          quizService.adminGetAllQuizzes(),
          quizService.adminGetAllCategories(),
        ]);

        return {
          quizData,
          categoryData,
        };
      },
      {
        errorMessage: 'Failed to fetch quizzes or categories',
      }
    );

    if (data) {
      setQuizzes(data.quizData);
      setCategories(data.categoryData);
    }
  };

  const createQuiz = async (quizData: any): Promise<Quiz> => {
    const newQuiz = await quizService.adminCreateQuiz(quizData);
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz;
  };

  const updateQuiz = async (id: number, quizData: any): Promise<Quiz> => {
    const updatedQuiz = await quizService.adminUpdateQuiz(id, quizData);
    setQuizzes(prev => prev.map(quiz => quiz.id === id ? updatedQuiz : quiz));
    return updatedQuiz;
  };

  const deleteQuiz = async (id: number): Promise<void> => {
    await quizService.adminDeleteQuiz(id);
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return {
    quizzes,
    categories,
    loading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
};
