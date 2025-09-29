import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { QuizContext } from './QuizContext';
import type { Quiz } from '../models/Quiz';
import { quizService } from '../services/QuizService';

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async () => {
  setLoading(true);
  try {
    const data = await quizService.getAllQuizzes();
    setQuizzes(data);
  } catch (error) {
    console.error('Failed to fetch quizzes', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
  const load = async () => {
    await fetchQuizzes();
  };
  load();
}, []); // prazno, da se izvrši samo jednom


  return (
    <QuizContext.Provider value={{ quizzes, loading, fetchQuizzes }}>
      {children}
    </QuizContext.Provider>
  );
};