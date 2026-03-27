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
    <div className="surface-card rounded-xl p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={handleBackClick}
          className="btn-secondary px-6 py-3 rounded-lg font-medium"
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
            className="btn-primary px-8 py-3 rounded-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizFooter;