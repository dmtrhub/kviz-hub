import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { Question } from '../models/Question';
import { useAsyncStatus } from './useAsyncStatus';

export const useAdminQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });

  const executeMutation = async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    const result = await execute(operation, {
      errorMessage,
      withLoading: false,
      clearError: false,
    });

    if (result === null) {
      throw new Error(errorMessage);
    }

    return result;
  };

  const fetchQuestions = async () => {
    const data = await execute(() => quizService.adminGetAllQuestions(), {
      errorMessage: 'Failed to fetch questions',
    });

    if (data) {
      setQuestions(data);
    }
  };

  const createQuestion = async (questionData: any) => {
    const newQuestion = await executeMutation(
      () => quizService.adminCreateQuestion(questionData.quizId, questionData),
      'Failed to create question'
    );
    setQuestions(prev => [...prev, newQuestion]);
    return newQuestion;
  };

  const updateQuestion = async (id: number, questionData: any) => {
    const updatedQuestion = await executeMutation(
      () => quizService.adminUpdateQuestion(id, questionData),
      'Failed to update question'
    );
    setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
    return updatedQuestion;
  };

  const deleteQuestion = async (id: number) => {
    await executeMutation(
      () => quizService.adminDeleteQuestion(id),
      'Failed to delete question'
    );
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion, 
    deleteQuestion,
  };
};