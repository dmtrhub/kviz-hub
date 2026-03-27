import React, { useEffect, useState } from "react";
import { useQuizzes } from "../hooks/useQuizzes";
import type { Quiz } from "../models/Quiz";
import type { Category } from "../models/Category";
import { useNavigate } from "react-router-dom";
import { quizService } from "../services/QuizService";

// Komponente
import QuizFilters from "../components/dashboard/QuizFilters";
import QuizCard from "../components/dashboard/QuizCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/dashboard/EmptyState";

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "All">("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | string>("All");
  const [page, setPage] = useState(1);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);

  const { quizzes, pagination, loading } = useQuizzes({
    keyword: searchTerm.trim() || undefined,
    categoryId: categoryFilter === "All" ? undefined : categoryFilter,
    difficulty: difficultyFilter === "All" ? undefined : difficultyFilter,
    page,
    pageSize: 9
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const data = await quizService.getAllQuizzes();
        setAllQuizzes(data);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

    loadFilterData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const categories: Category[] = Array.from(
    new Map(
      allQuizzes.flatMap((q) => q.categories ?? []).map((cat) => [cat.id, cat])
    ).values()
  );

  const difficulties = Array.from(new Set(allQuizzes.map((q) => q.difficulty)));

  if (loading) {
    return <LoadingSpinner message="Loading quizzes..." />;
  }

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter komponenta */}
        <QuizFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          difficultyFilter={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
          categories={categories}
          difficulties={difficulties}
        />

        {/* Quiz kartice */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.length === 0 ? (
            <EmptyState />
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={() => navigate(`/quizzes/${quiz.id}`)}
              />
            ))
          )}
        </div>

        {pagination.totalCount > 0 && (
          <div className="surface-card rounded-xl p-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing page {pagination.page} of {Math.max(1, pagination.totalPages)} ({pagination.totalCount} quizzes)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={pagination.page <= 1}
                className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => setPage((prev) => Math.min(pagination.totalPages || 1, prev + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;