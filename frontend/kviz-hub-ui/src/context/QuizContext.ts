import { createContext } from 'react';
import type { Quiz } from '../models/Quiz';

export interface QuizContextType {
  quizzes: Quiz[];
  loading: boolean;
  fetchQuizzes: () => Promise<void>;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);