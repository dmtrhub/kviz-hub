import React, { useEffect, useState } from "react";
import { useQuizzes } from "../hooks/useQuizzes";
import type { Quiz } from "../models/Quiz";
import type { Category } from "../models/Category";
import { useNavigate } from "react-router-dom";

// Komponente
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuizFilters from "../components/dashboard/QuizFilters";
import QuizCard from "../components/dashboard/QuizCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/dashboard/EmptyState";

const Dashboard: React.FC = () => {
  const { quizzes, loading, fetchQuizzes } = useQuizzes();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "All">("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | string>("All");
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let result = quizzes;

    if (categoryFilter !== "All") {
      result = result.filter((q) =>
        q.categories?.some((cat) => cat.id === categoryFilter)
      );
    }

    if (difficultyFilter !== "All") {
      result = result.filter((q) => q.difficulty === difficultyFilter);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuizzes(result);
  }, [quizzes, searchTerm, categoryFilter, difficultyFilter]);

  const categories: Category[] = Array.from(
    new Map(
      quizzes.flatMap((q) => q.categories ?? []).map((cat) => [cat.id, cat])
    ).values()
  );

  const difficulties = Array.from(new Set(quizzes.map((q) => q.difficulty)));

  if (loading) {
    return <LoadingSpinner message="Loading quizzes..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header komponenta */}
        <DashboardHeader />

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
          {filteredQuizzes.length === 0 ? (
            <EmptyState />
          ) : (
            filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={() => navigate(`/quizzes/${quiz.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;