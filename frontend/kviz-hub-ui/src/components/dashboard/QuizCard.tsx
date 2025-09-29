import React from "react";
import { FaQuestionCircle, FaClock } from "react-icons/fa";
import type { Quiz } from "../../models/Quiz";

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{quiz.title}</h2>
      <p className="text-gray-600 mb-4 flex-grow">{quiz.description}</p>

      {/* Meta info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <FaQuestionCircle className="mr-2" />
          <span>{quiz.questionCount ?? 0} questions</span>
        </div>
        {quiz.timeLimit && (
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2" />
            <span>{quiz.timeLimit} minutes</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quiz.categories?.map((cat) => (
          <span
            key={cat.id}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
          >
            {cat.name}
          </span>
        ))}
      </div>

      <button
        onClick={onStartQuiz}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg mt-auto"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;