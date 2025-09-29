import type { Category } from "./Category";
import type { Question } from "./Question";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: string;
  categories: Category[];
  questions?: Question[];
  questionCount: number;
}
