import React from "react";
import { FaArrowLeft, FaRedo } from "react-icons/fa";

interface ResultsActionsProps {
  onBackToQuizzes: () => void;
  onTryAgain: () => void;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ 
  onBackToQuizzes, 
  onTryAgain 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBackToQuizzes}
          className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium flex items-center space-x-2 group"
        >
          <FaArrowLeft className="text-gray-500 group-hover:text-blue-600 transition-colors" />
          <span>Back to Quizzes</span>
        </button>
        
        <button
          onClick={onTryAgain}
          className="bg-white text-green-600 px-6 py-3 rounded-xl border border-green-300 hover:border-green-500 hover:text-green-700 transition-all duration-200 font-medium flex items-center space-x-2 group"
        >
          <FaRedo className="text-green-500 group-hover:text-green-700 transition-colors" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsActions;