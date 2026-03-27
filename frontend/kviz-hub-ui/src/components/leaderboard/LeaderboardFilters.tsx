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
    <div className="surface-card rounded-2xl p-6 md:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-slate-700 p-2.5 shadow-md">
            <FaFilter className="text-sm text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Leaderboard Filters</h3>
            <p className="text-sm text-slate-500">Refine results by quiz, period, and ranking range.</p>
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="btn-secondary inline-flex items-center space-x-2 rounded-xl px-4 py-2 font-medium"
        >
          <FaSync className="text-slate-500 transition-transform duration-500 group-hover:rotate-180" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filters Layout */}
      <div className="mb-6 flex flex-col gap-5">
        {/* Quiz Filter */}
        <div className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label className="mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700">
            <FaChartBar className="text-blue-500" />
            <span>Select Quiz</span>
          </label>
          <select
            value={filters.quizId || "all"}
            onChange={handleQuizChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-base text-slate-800 transition-all hover:bg-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label className="mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700">
            <FaClock className="text-slate-600" />
            <span>Time Period</span>
          </label>
          <select
            value={filters.timePeriod || "all"}
            onChange={handleTimePeriodChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-base text-slate-800 transition-all hover:bg-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Time</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {/* Top Results Filter */}
        <div className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <label className="mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700">
            <FaTrophy className="text-yellow-500" />
            <span>Show Top</span>
          </label>
          <select
            value={filters.top || 50}
            onChange={handleTopChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-base text-slate-800 transition-all hover:bg-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-slate-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="flex items-center space-x-2 text-sm font-semibold text-blue-800">
              <FaFilter className="text-blue-600" />
              <span>Active Filters</span>
            </p>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
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
                <span>{getSelectedQuizTitle()}</span>
                <button 
                  onClick={() => removeFilter('quizId')}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            
            {filters.timePeriod !== "all" && (
              <span className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200">
                <span>{filters.timePeriod === "weekly" ? "This Week" : "This Month"}</span>
                <button 
                  onClick={() => removeFilter('timePeriod')}
                  className="text-slate-600 hover:text-slate-700 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            
            {filters.top !== 50 && (
              <span className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium border border-yellow-200">
                <span>Top {filters.top}</span>
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
        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-4 text-center">
          <p className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <FaFilter className="text-slate-400" />
            <span>No filters applied - showing all results</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilters;