import React from "react";
import type { UserAnswerResponse } from "../../models/QuizAttempt";
import { FaCircle } from "react-icons/fa";

interface QuestionResultProps {
  userAnswer: UserAnswerResponse;
  questionNumber: number;
}

const QuestionResult: React.FC<QuestionResultProps> = ({ userAnswer, questionNumber }) => {
  const isCorrect = userAnswer.isCorrect;

  const getQuestionTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      "SingleChoice": "🔘",
      "MultipleChoice": "☑️",
      "FillInBlank": "📝",
      "TrueFalse": "✅"
    };
    return icons[type] || "❓";
  };

  const getSelectedOptionsText = (userAnswer: UserAnswerResponse): string => {
    if (userAnswer.questionType === "FillInBlank") {
      return userAnswer.textAnswer || "[No answer]";
    }
    
    if (userAnswer.selectedOptionIds && userAnswer.selectedOptionIds.length > 0) {
      return `Selected ${userAnswer.selectedOptionIds.length} option(s)`;
    }
    
    return "[No options selected]";
  };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${
      isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold mt-1 ${
            isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {questionNumber}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-medium text-gray-900">{userAnswer.questionText}</h3>
              <span className="flex items-center space-x-1 text-sm text-gray-500">
                {getQuestionTypeIcon(userAnswer.questionType)}
                <span className="capitalize">
                  {userAnswer.questionType.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <FaCircle className={`text-xs ${
                  isCorrect ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Your answer: {getSelectedOptionsText(userAnswer)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaCircle className="text-xs text-gray-400" />
                <span className="text-sm text-gray-700">
                  {isCorrect ? "Correct answer" : "Incorrect answer"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
          <div className="text-xs text-gray-500 mt-1">{userAnswer.points} points</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
        <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? `+${userAnswer.points} points awarded` : '0 points'}
        </span>
      </div>
    </div>
  );
};

export default QuestionResult;