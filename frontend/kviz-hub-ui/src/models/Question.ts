export type QuestionType = "SingleChoice" | "MultipleChoice" | "TrueFalse" | "FillInBlank";

export interface AnswerOption {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  points: number;
  quizId: number;
  answerOptions: AnswerOption[];
}