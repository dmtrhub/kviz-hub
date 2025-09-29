export interface QuizAttemptResponse {
  id: number;
  quizId: number;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: string;
  finishedAt?: string;
  answers: UserAnswerResponse[];
}

export interface SubmitAnswerRequest {
  questionId: number;
  selectedAnswerOptionIds: number[];
  textAnswer: string;
}

export interface SubmitQuizRequest {
  answers: SubmitAnswerRequest[];
}

export interface UserAnswerResponse {
  questionId: number;
  questionText: string;
  questionType: string;
  isCorrect: boolean;
  points: number;
  selectedOptionIds?: number[];
  textAnswer?: string;
  details: AnswerDetail[];
}

export interface AnswerDetail {
  text: string;
  isCorrect: boolean;
}