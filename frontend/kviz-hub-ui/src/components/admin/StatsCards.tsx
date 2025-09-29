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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaUser className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-xl">
            <FaCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-xl">
            <FaChartBar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center">
          <div className="bg-orange-100 p-3 rounded-xl">
            <FaClock className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageDuration}m
            </div>
            <div className="text-sm text-gray-600">Avg Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
};
