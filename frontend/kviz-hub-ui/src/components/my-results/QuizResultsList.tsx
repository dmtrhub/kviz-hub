import React from "react";
import type { MyQuizResult } from "../../models/MyResults";
import QuizResultCard from "./QuizResultCard";
import { FaClipboardList } from "react-icons/fa";

interface QuizResultsListProps {
  results: MyQuizResult[];
  onViewDetails: (attemptId: number) => void;
}

const QuizResultsList: React.FC<QuizResultsListProps> = ({
  results,
  onViewDetails,
}) => {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
        <FaClipboardList className="text-gray-300 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results yet</h3>
        <p className="text-gray-600 mb-6">
          Complete some quizzes to see your results here!
        </p>
        <button
          onClick={() => (window.location.href = "/quizzes")}
          className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium"
        >
          Browse Quizzes
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        All Quiz Attempts
      </h2>

      <div className="space-y-4">
        {results.map((result) => (
          <QuizResultCard
            key={result.attemptId}
            result={result}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizResultsList;