import { useState, useEffect } from 'react';
import { quizApi } from '../api/quizApi';
import type { Quiz, QuizQueryParams, QuizzesPagination } from '../models/Quiz';
import { useAsyncStatus } from './useAsyncStatus';

const DEFAULT_PAGINATION: QuizzesPagination = {
  totalCount: 0,
  page: 1,
  pageSize: 9,
  totalPages: 1
};

export const useQuizzes = (params: QuizQueryParams) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pagination, setPagination] = useState<QuizzesPagination>(DEFAULT_PAGINATION);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });

  const fetchQuizzes = async () => {
    const response = await execute(() => quizApi.getPagedQuizzes(params), {
      errorMessage: 'Failed to fetch quizzes',
    });

    if (response) {
      setQuizzes(response.items);
      setPagination(response.pagination);
    } else {
      setQuizzes([]);
      setPagination(DEFAULT_PAGINATION);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [params.keyword, params.categoryId, params.difficulty, params.page, params.pageSize]);

  return { quizzes, pagination, loading, error, fetchQuizzes };
};