import React from "react";
import type { UserAnswerResponse } from "../../models/QuizAttempt";

interface AnswerItemProps {
  answer: UserAnswerResponse;
  index: number;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({ answer, index }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="font-medium text-gray-900 flex-1">
          <span className="text-blue-600">Q{index + 1}:</span>{" "}
          {answer.questionText}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            answer.isCorrect
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"} ({answer.points} pts)
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
            {answer.questionType}
          </span>
        </div>

        {/* Fill in the Blank prikaz */}
        {answer.questionType === "FillInBlank" && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={`font-medium flex items-center ${
                answer.isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {answer.isCorrect ? "✓" : "✗"}
              <span className="ml-2">User's answer: "{answer.textAnswer}"</span>
            </div>

            {answer.details && answer.details.length > 0 && (
              <div className="text-green-600 mt-2 flex items-center">
                ✓{" "}
                <span className="ml-2">
                  Correct answer:{" "}
                  {answer.details.find((d) => d.isCorrect)?.text.split(": ")[1]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Ostali tipovi pitanja */}
        {answer.questionType !== "FillInBlank" &&
          answer.details &&
          answer.details.length > 0 && (
            <div className="mt-3 space-y-2">
              {answer.details.map((detail, idx) => (
                <div
                  key={idx}
                  className={`flex items-center p-2 rounded-lg ${
                    detail.isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <span
                    className={
                      detail.isCorrect
                        ? "text-green-600 mr-2"
                        : "text-red-600 mr-2"
                    }
                  >
                    {detail.isCorrect ? "✓" : "✗"}
                  </span>
                  <span
                    className={
                      detail.isCorrect ? "text-green-800" : "text-red-800"
                    }
                  >
                    {detail.text}
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
