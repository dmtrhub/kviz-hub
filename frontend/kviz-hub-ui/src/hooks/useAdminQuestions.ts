import { useState, useEffect } from 'react';
import { quizService } from '../services/QuizService';
import type { Question } from '../models/Question';

export const useAdminQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizService.adminGetAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: any) => {
    try {
      const newQuestion = await quizService.adminCreateQuestion(
        questionData.quizId, 
        questionData
      );
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      throw new Error('Failed to create question');
    }
  };

  const updateQuestion = async (id: number, questionData: any) => {
    try {
      const updatedQuestion = await quizService.adminUpdateQuestion(id, questionData);
      setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
      return updatedQuestion;
    } catch (err) {
      throw new Error('Failed to update question');
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await quizService.adminDeleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      throw new Error('Failed to delete question');
    }
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