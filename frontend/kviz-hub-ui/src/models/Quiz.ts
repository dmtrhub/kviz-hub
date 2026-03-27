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

export interface QuizQueryParams {
  keyword?: string;
  categoryId?: number;
  difficulty?: string;
  page: number;
  pageSize: number;
}

export interface QuizzesPagination {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedQuizzesResponse {
  items: Quiz[];
  pagination: QuizzesPagination;
}
