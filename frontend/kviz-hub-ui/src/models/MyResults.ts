export interface MyQuizResult {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  startedAt: string;
  finishedAt: string;
  duration: number; // u minutima
}

export interface QuizProgress {
  quizId: number;
  quizTitle: string;
  attempts: QuizAttemptProgress[];
  bestScore: number;
  averageScore: number;
  improvement: number; // procentualno poboljšanje
}

export interface QuizAttemptProgress {
  attemptId: number;
  score: number;
  percentage: number;
  date: string;
  duration: number;
}