import React from "react";

interface QuizFooterProps {
  answersCount: number;
  totalQuestions: number;
  onSubmit: () => void;
  submitting: boolean;
  onNavigateBack: () => void;
}

const QuizFooter: React.FC<QuizFooterProps> = ({
  answersCount,
  totalQuestions,
  onSubmit,
  submitting,
  onNavigateBack,
}) => {
  const handleBackClick = () => {
    if (window.confirm("Are you sure you want to leave? Your progress will be lost.")) {
      onNavigateBack();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={handleBackClick}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          ← Back to Quizzes
        </button>
        
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {answersCount === totalQuestions ? "All questions answered!" : `${totalQuestions - answersCount} questions remaining`}
          </p>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition font-medium shadow-lg"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizFooter;