import React from "react";
import type { QuizProgress } from "../../models/MyResults";

interface ProgressChartProps {
  progress: QuizProgress;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  const maxPercentage = Math.max(...progress.attempts.map(a => a.percentage));
  
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{progress.quizTitle}</h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Best Score</div>
          <div className={`text-xl font-bold ${getScoreColor(progress.bestScore)}`}>
            {progress.bestScore}%
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {progress.attempts.map((attempt, index) => (
          <div key={attempt.attemptId} className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 w-16">
              Attempt {index + 1}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getBarColor(attempt.percentage)}`}
                style={{ width: `${(attempt.percentage / maxPercentage) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${getScoreColor(attempt.percentage)} w-12`}>
              {attempt.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
        <span>Average: {progress.averageScore}%</span>
        <span className={progress.improvement >= 0 ? "text-green-600" : "text-red-600"}>
          Improvement: {progress.improvement >= 0 ? '+' : ''}{progress.improvement}%
        </span>
      </div>
    </div>
  );
};

export default ProgressChart;