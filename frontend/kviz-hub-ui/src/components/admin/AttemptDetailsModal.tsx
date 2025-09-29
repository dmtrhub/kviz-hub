import React from "react";
import { FaTimes, FaChartBar } from "react-icons/fa";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";
import { AnswerItem } from "./AnswerItem";

interface AttemptDetailsModalProps {
  attempt: QuizAttemptResponse;
  onClose: () => void;
  formatUserId: (userId: string) => string;
  calculatePercentage: (attempt: QuizAttemptResponse) => number;
  calculateDuration: (attempt: QuizAttemptResponse) => number;
}

export const AttemptDetailsModal: React.FC<AttemptDetailsModalProps> = ({
  attempt,
  onClose,
  formatUserId,
  calculatePercentage,
  calculateDuration,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Attempt Details - Quiz #{attempt.quizId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500">User ID</div>
              <div className="font-medium text-lg">
                {formatUserId(attempt.userId)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500">Score</div>
              <div className="font-medium text-lg">
                {calculatePercentage(attempt)}%
                <span className="text-gray-500 text-sm ml-2">
                  ({attempt.correctAnswers}/{attempt.totalQuestions})
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-medium text-lg">
                {calculateDuration(attempt)} minutes
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-500" />
            Answers
          </h3>

          <div className="space-y-4">
            {attempt.answers && attempt.answers.length > 0 ? (
              attempt.answers.map((answer, index) => (
                <AnswerItem
                  key={answer.questionId}
                  answer={answer}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                <p>No answers available for this attempt</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
