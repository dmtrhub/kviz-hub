import React from "react";
import type { MyQuizResult } from "../../models/MyResults";
import { FaCalendar, FaClock, FaCheck, FaArrowRight } from "react-icons/fa";

interface QuizResultCardProps {
  result: MyQuizResult;
  onViewDetails: (attemptId: number) => void;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({ result, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return "< 1m";
    return `${Math.round(minutes)}m`;
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {result.quizTitle}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400 text-xs" />
              <span>{formatDate(result.finishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400 text-xs" />
              <span>{formatDuration(result.duration)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheck className="text-gray-400 text-xs" />
              <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <div className="text-sm text-gray-600">
              {result.score} points
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(result.attemptId);
            }}
            className="bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium flex items-center space-x-2 group"
          >
            <span>Details</span>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultCard;