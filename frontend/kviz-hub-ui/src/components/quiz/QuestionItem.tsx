import React from "react";
import type { Question } from "../../models/Question";
import type { UserAnswerResponse } from "../../models/QuizAttempt";

interface QuestionItemProps {
  question: Question;
  questionNumber: number;
  userAnswer: UserAnswerResponse | undefined;
  onSelectOption: (questionId: number, optionId: number, type: string) => void;
  onTextAnswer: (questionId: number, value: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  questionNumber,
  userAnswer,
  onSelectOption,
  onTextAnswer,
}) => {
  const isAnswered = userAnswer && 
    ((question.type === "FillInBlank" && userAnswer.textAnswer && userAnswer.textAnswer.trim() !== "") ||
     (userAnswer.selectedOptionIds && userAnswer.selectedOptionIds.length > 0));

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
      isAnswered ? 'ring-2 ring-green-200' : 'ring-1 ring-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
            {questionNumber}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">{question.text}</h3>
        </div>
        {isAnswered && (
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            ✓ Answered
          </span>
        )}
      </div>

      <div className="mt-4">
        {question.type === "FillInBlank" ? (
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Type your answer here..."
            value={userAnswer?.textAnswer || ""}
            onChange={(e) => onTextAnswer(question.id, e.target.value)}
          />
        ) : (
          <div className="space-y-3">
            {question.answerOptions.map((option) => {
              const isSelected = userAnswer?.selectedOptionIds?.includes(option.id);
              const inputType = question.type === "MultipleChoice" ? "checkbox" : "radio";
              
              return (
                <label key={option.id} className={`
                  flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}>
                  <input
                    type={inputType}
                    name={`question-${question.id}`}
                    checked={isSelected || false}
                    onChange={() => onSelectOption(question.id, option.id, question.type)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1 text-gray-700">{option.text}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;