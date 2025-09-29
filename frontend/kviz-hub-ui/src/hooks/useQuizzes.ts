import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import type { Quiz } from '../models/Quiz';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Quiz[]>('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return { quizzes, loading, fetchQuizzes };
};