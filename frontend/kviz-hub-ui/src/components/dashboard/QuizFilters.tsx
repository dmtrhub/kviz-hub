import React from "react";
import { FaSearch } from "react-icons/fa";
import type { Category } from "../../models/Category";

interface QuizFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: number | "All";
  onCategoryChange: (category: number | "All") => void;
  difficultyFilter: string;
  onDifficultyChange: (difficulty: string) => void;
  categories: Category[];
  difficulties: string[];
}

const QuizFilters: React.FC<QuizFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  difficultyFilter,
  onDifficultyChange,
  categories,
  difficulties,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="border border-gray-300 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) =>
            onCategoryChange(e.target.value === "All" ? "All" : Number(e.target.value))
          }
          className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuizFilters;