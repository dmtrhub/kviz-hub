import React from "react";
import type { Quiz } from "../../models/Quiz";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";

interface QuizHeaderProps {
  quiz: Quiz | null;
  attempt: QuizAttemptResponse | null;
  timeLeft: number;
  answersCount: number;
  totalQuestions: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  quiz,
  attempt,
  timeLeft,
  answersCount,
  totalQuestions,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz?.title || `Quiz #${attempt?.quizId}`}</h1>
          <p className="text-gray-600 mt-1">
            {totalQuestions} questions • {formatTime(timeLeft)} left • 
            Answered: {answersCount}/{totalQuestions}
          </p>
        </div>
        
        <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
          timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answersCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-1 text-center">
          {answersCount} of {totalQuestions} questions answered
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;