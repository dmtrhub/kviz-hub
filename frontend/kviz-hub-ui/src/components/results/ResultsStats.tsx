import React from "react";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";
import { FaCheck, FaTimes, FaQuestion, FaList } from "react-icons/fa";

interface ResultsStatsProps {
  attempt: QuizAttemptResponse;
  percentage: number;
}

const ResultsStats: React.FC<ResultsStatsProps> = ({ attempt }) => {
  const stats = [
    { 
      label: "Correct Answers", 
      value: attempt.correctAnswers,
      icon: FaCheck,
      color: "text-green-600"
    },
    { 
      label: "Incorrect Answers", 
      value: attempt.totalQuestions - attempt.correctAnswers,
      icon: FaTimes,
      color: "text-red-600"
    },
    { 
      label: "Total Questions", 
      value: attempt.totalQuestions,
      icon: FaQuestion,
      color: "text-blue-600"
    },
    { 
      label: "Questions Answered", 
      value: attempt.answers.length,
      icon: FaList,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <stat.icon className={`text-lg mx-auto mb-2 ${stat.color}`} />
            <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsStats;