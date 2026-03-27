import React from "react";
import { FaUser, FaCheck, FaChartBar, FaClock } from "react-icons/fa";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";

interface StatsCardsProps {
  attempts: QuizAttemptResponse[];
  calculatePercentage: (attempt: QuizAttemptResponse) => number;
  calculateDuration: (attempt: QuizAttemptResponse) => number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  attempts,
  calculatePercentage,
  calculateDuration,
}) => {
  const stats = {
    total: attempts.length,
    completed: attempts.filter((a) => a.finishedAt).length,
    averageScore:
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + calculatePercentage(a), 0) /
              attempts.length
          )
        : 0,
    averageDuration:
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + calculateDuration(a), 0) /
              attempts.length
          )
        : 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div className="surface-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-600 text-sm font-medium mb-1">Total Attempts</div>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaUser className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-600 text-sm font-medium mb-1">Completed</div>
            <div className="text-3xl font-bold text-slate-900">{stats.completed}</div>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <FaCheck className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-600 text-sm font-medium mb-1">Average Score</div>
            <div className="text-3xl font-bold text-slate-900">{stats.averageScore}%</div>
          </div>
          <div className="bg-slate-100 p-3 rounded-xl">
            <FaChartBar className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-600 text-sm font-medium mb-1">Avg Duration</div>
            <div className="text-3xl font-bold text-slate-900">{stats.averageDuration}m</div>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <FaClock className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
