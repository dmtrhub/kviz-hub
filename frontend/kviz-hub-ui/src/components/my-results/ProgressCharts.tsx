import React from "react";
import type { QuizProgress } from "../../models/MyResults";
import ProgressChart from "./ProgressChart";
import { FaChartLine } from "react-icons/fa";

interface ProgressChartsProps {
  progress: QuizProgress[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ progress }) => {
  if (progress.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
        <FaChartLine className="text-gray-300 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No progress data</h3>
        <p className="text-gray-600 mb-6">
          Complete quizzes multiple times to see your progress!
        </p>
        <button
          onClick={() => window.location.href = "/quizzes"}
          className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium"
        >
          Try More Quizzes
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Progress Overview
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {progress.map(progressItem => (
          <ProgressChart
            key={progressItem.quizId}
            progress={progressItem}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressCharts;