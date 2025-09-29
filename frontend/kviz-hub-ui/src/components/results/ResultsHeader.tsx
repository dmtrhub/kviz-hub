import React from "react";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";
import { FaTrophy, FaCalendar } from "react-icons/fa";

interface ResultsHeaderProps {
  attempt: QuizAttemptResponse;
  percentage: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ attempt, percentage }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number): string => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Passed";
    return "Needs Improvement";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-sm">
            <FaTrophy className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz Results
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaCalendar className="text-gray-400 text-sm" />
              <span>Completed on {formatDate(attempt.finishedAt || attempt.startedAt)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Attempt ID: {attempt.id}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-300 text-center min-w-[180px]">
          <div className={`text-3xl font-bold mb-1 ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <div className="text-sm font-semibold text-gray-700 mb-2">
            {getScoreBadge(percentage)}
          </div>
          <div className="text-gray-500 text-sm">
            {attempt.score} points
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;