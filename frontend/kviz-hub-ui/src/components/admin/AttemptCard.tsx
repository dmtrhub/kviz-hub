import React from "react";
import { FaEye, FaUser } from "react-icons/fa";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";

interface AttemptCardProps {
  attempt: QuizAttemptResponse;
  onViewDetails: (attempt: QuizAttemptResponse) => void;
  formatUserId: (userId: string) => string;
  calculatePercentage: (attempt: QuizAttemptResponse) => number;
  calculateDuration: (attempt: QuizAttemptResponse) => number;
  getScoreColor: (percentage: number) => string;
  getScoreBgColor: (percentage: number) => string;
  getStatusColor: (finished: boolean) => string;
}

export const AttemptCard: React.FC<AttemptCardProps> = ({
  attempt,
  onViewDetails,
  formatUserId,
  calculatePercentage,
  calculateDuration,
  getScoreColor,
  getScoreBgColor,
  getStatusColor,
}) => {
  const percentage = calculatePercentage(attempt);
  const duration = calculateDuration(attempt);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-2 rounded-lg">
              <FaUser className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                User: {formatUserId(attempt.userId)}
              </div>
              <div className="text-sm text-gray-500">
                Quiz #{attempt.quizId}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getScoreColor(percentage)}`}
              >
                {percentage}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {attempt.correctAnswers}/{attempt.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {duration}m
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  !!attempt.finishedAt
                )}`}
              >
                {attempt.finishedAt ? "Completed" : "In Progress"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(attempt)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg ml-4"
        >
          <FaEye className="text-lg" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${getScoreBgColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Started: {new Date(attempt.startedAt).toLocaleDateString()}</span>
        {attempt.finishedAt && (
          <span>
            Finished: {new Date(attempt.finishedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
