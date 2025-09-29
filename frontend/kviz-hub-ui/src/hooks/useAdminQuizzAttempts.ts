import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { QuizAttemptResponse } from '../models/QuizAttempt';

export const useAdminQuizAttempts = () => {
  const [attempts, setAttempts] = useState<QuizAttemptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAttempts = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await quizService.adminGetAllQuizAttempts();
    
    console.log('📊 API Response - All attempts:', data);
    console.log('📋 Number of attempts:', data.length);
    
    if (data.length > 0) {
      const firstAttempt = data[0];
      console.log('🔍 First attempt analysis:', {
        id: firstAttempt.id,
        quizId: firstAttempt.quizId,
        userId: firstAttempt.userId,
        score: firstAttempt.score,
        totalQuestions: firstAttempt.totalQuestions,
        correctAnswers: firstAttempt.correctAnswers,
        startedAt: firstAttempt.startedAt,
        finishedAt: firstAttempt.finishedAt,
        answersCount: firstAttempt.answers?.length || 0,
        answers: firstAttempt.answers
      });
      
      // Proverava da li su brojevi validni
      if (firstAttempt.totalQuestions === undefined || firstAttempt.totalQuestions === null) {
        console.warn('⚠️ totalQuestions is undefined/null');
      }
      if (firstAttempt.correctAnswers === undefined || firstAttempt.correctAnswers === null) {
        console.warn('⚠️ correctAnswers is undefined/null');
      }
    }
    
    setAttempts(data);
  } catch (err) {
    setError('Failed to fetch quiz attempts');
    console.error('Error fetching quiz attempts:', err);
  } finally {
    setLoading(false);
  }
};

  const fetchAttemptsByQuiz = async (quizId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.adminGetQuizAttemptsByQuiz(quizId);
      setAttempts(data);
    } catch (err) {
      setError('Failed to fetch quiz attempts');
      console.error('Error fetching quiz attempts:', err);
    } finally {
      setLoading(false);
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