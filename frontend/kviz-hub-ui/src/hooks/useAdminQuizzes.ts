import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { Quiz } from '../models/Quiz';
import type { Category } from '../models/Category';

export const useAdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof quizService.adminGetAllQuizzes !== 'function') {
        throw new Error('adminGetAllQuizzes method does not exist on quizService');
      }

      const data = await quizService.adminGetAllQuizzes();
      setQuizzes(data);

      // fetch categories
      if (typeof quizService.adminGetAllCategories === 'function') {
        const catData = await quizService.adminGetAllCategories();
        setCategories(catData);
      }
    } catch (err) {
      setError('Failed to fetch quizzes or categories');
      console.error('Error fetching quizzes/categories:', err);
    } finally {
      setLoading(false);
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
