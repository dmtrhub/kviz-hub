import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { QuizAttemptResponse } from '../models/QuizAttempt';
import { useAsyncStatus } from './useAsyncStatus';

export const useAdminQuizAttempts = () => {
  const [attempts, setAttempts] = useState<QuizAttemptResponse[]>([]);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });

  const fetchAllAttempts = async () => {
    const data = await execute(() => quizService.adminGetAllQuizAttempts(), {
      errorMessage: 'Failed to fetch quiz attempts',
    });

    if (data) {
      setAttempts(data);
    }
  };

  const fetchAttemptsByQuiz = async (quizId: number) => {
    const data = await execute(
      () => quizService.adminGetQuizAttemptsByQuiz(quizId),
      {
        errorMessage: 'Failed to fetch quiz attempts',
      }
    );

    if (data) {
      setAttempts(data);
    }
  };

  useEffect(() => {
    fetchAllAttempts();
  }, []);

  return {
    attempts,
    loading,
    error,
    fetchAllAttempts,
    fetchAttemptsByQuiz,
  };
};