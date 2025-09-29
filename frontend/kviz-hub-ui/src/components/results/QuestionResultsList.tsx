import React from "react";
import type { UserAnswerResponse } from "../../models/QuizAttempt";
import QuestionResult from "./QuestionResult";

interface QuestionResultsListProps {
  answers: UserAnswerResponse[];
}

const QuestionResultsList: React.FC<QuestionResultsListProps> = ({ answers }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Detailed Results
      </h2>
      
      <div className="space-y-4">
        {answers.length > 0 ? (
          answers.map((userAnswer, index) => (
            <QuestionResult
              key={userAnswer.questionId}
              userAnswer={userAnswer}
              questionNumber={index + 1}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No answer details available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionResultsList;