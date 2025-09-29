import React from "react";
import type { LeaderboardFilter, QuizOption } from "../../models/Leaderboard";
import { FaFilter, FaSync, FaChartBar, FaClock, FaTrophy, FaTimes } from "react-icons/fa";

interface LeaderboardFiltersProps {
  filters: LeaderboardFilter;
  quizzes: QuizOption[];
  onFilterChange: (filters: LeaderboardFilter) => void;
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({ 
  filters, 
  quizzes, 
  onFilterChange 
}) => {
  const handleQuizChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quizId = e.target.value === "all" ? undefined : Number(e.target.value);
    onFilterChange({ ...filters, quizId });
  };

  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timePeriod = e.target.value as "all" | "weekly" | "monthly";
    onFilterChange({ ...filters, timePeriod });
  };

  const handleTopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const top = Number(e.target.value);
    onFilterChange({ ...filters, top });
  };

  const resetFilters = () => {
    onFilterChange({ quizId: undefined, timePeriod: "all", top: 50 });
  };

  const removeFilter = (filterType: keyof LeaderboardFilter) => {
    if (filterType === 'quizId') {
      onFilterChange({ ...filters, quizId: undefined });
    } else if (filterType === 'timePeriod') {
      onFilterChange({ ...filters, timePeriod: "all" });
    } else if (filterType === 'top') {
      onFilterChange({ ...filters, top: 50 });
    }
  };

  const getSelectedQuizTitle = () => {
    if (!filters.quizId) return "All Quizzes";
    const quiz = quizzes.find(q => q.id === filters.quizId);
    return quiz?.title || "Unknown Quiz";
  };

  const hasActiveFilters = filters.quizId || filters.timePeriod !== "all" || filters.top !== 50;

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <FaFilter className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Leaderboard Filters</h3>
            <p className="text-gray-500 text-sm">Refine your leaderboard view</p>
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium flex items-center space-x-2 group"
        >
          <FaSync className="text-gray-500 group-hover:rotate-180 transition-transform duration-500" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Quiz Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <FaChartBar className="text-blue-500" />
            <span>Select Quiz</span>
          </label>
          <select
            value={filters.quizId || "all"}
            onChange={handleQuizChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          >
            <option value="all">All Quizzes</option>
            {quizzes.map(quiz => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        {/* Time Period Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <FaClock className="text-purple-500" />
            <span>Time Period</span>
          </label>
          <select
            value={filters.timePeriod || "all"}
            onChange={handleTimePeriodChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          >
            <option value="all">All Time</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {/* Top Results Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <FaTrophy className="text-yellow-500" />
            <span>Show Top</span>
          </label>
          <select
            value={filters.top || 50}
            onChange={handleTopChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-blue-800 flex items-center space-x-2">
              <span>🎯</span>
              <span>Active Filters</span>
            </p>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {[
                filters.quizId ? 1 : 0,
                filters.timePeriod !== "all" ? 1 : 0,
                filters.top !== 50 ? 1 : 0
              ].reduce((a, b) => a + b, 0)} active
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.quizId && (
              <span className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                <span>📝 {getSelectedQuizTitle()}</span>
                <button 
                  onClick={() => removeFilter('quizId')}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            
            {filters.timePeriod !== "all" && (
              <span className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-200">
                <span>⏰ {filters.timePeriod === "weekly" ? "This Week" : "This Month"}</span>
                <button 
                  onClick={() => removeFilter('timePeriod')}
                  className="text-purple-500 hover:text-purple-700 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            
            {filters.top !== 50 && (
              <span className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium border border-yellow-200">
                <span>🏆 Top {filters.top}</span>
                <button 
                  onClick={() => removeFilter('top')}
                  className="text-yellow-500 hover:text-yellow-700 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* No Active Filters Message */}
      {!hasActiveFilters && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-2">
            <span>🔍</span>
            <span>No filters applied - showing all results</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilters;