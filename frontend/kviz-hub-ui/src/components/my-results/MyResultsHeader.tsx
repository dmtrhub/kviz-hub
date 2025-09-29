import React from "react";
import { FaArrowLeft, FaChartLine } from "react-icons/fa";

interface MyResultsHeaderProps {
  onBackToQuizzes: () => void;
}

const MyResultsHeader: React.FC<MyResultsHeaderProps> = ({ onBackToQuizzes }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-sm">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Results
            </h1>
            <p className="text-gray-600">
              Track your quiz performance and progress over time
            </p>
          </div>
        </div>
        
        <button
          onClick={onBackToQuizzes}
          className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium flex items-center space-x-2 group"
        >
          <FaArrowLeft className="text-gray-500 group-hover:text-blue-600 transition-colors" />
          <span>Back to Quizzes</span>
        </button>
      </div>
    </div>
  );
};

export default MyResultsHeader;