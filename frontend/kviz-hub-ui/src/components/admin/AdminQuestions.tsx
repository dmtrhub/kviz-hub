import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useAdminQuestions } from "../../hooks/useAdminQuestions";
import { useAdminQuizzes } from "../../hooks/useAdminQuizzes";
import { quizService } from "../../services/QuizService";
import QuestionModal from "./QuestionModal";
import type { Question } from "../../models/Question";

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "SingleChoice":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "MultipleChoice":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "TrueFalse":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "FillInBlank":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SingleChoice":
        return "Single Choice";
      case "MultipleChoice":
        return "Multiple Choice";
      case "TrueFalse":
        return "True/False";
      case "FillInBlank":
        return "Fill in Blank";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SingleChoice":
        return "🔘";
      case "MultipleChoice":
        return "☑️";
      case "TrueFalse":
        return "✅";
      case "FillInBlank":
        return "📝";
      default:
        return "❓";
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete this question?\n\n"${question.text}"`
      )
    ) {
      onDelete(question.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{getTypeIcon(question.type)}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(
                question.type
              )}`}
            >
              {getTypeLabel(question.type)}
            </span>
            <span className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-200">
              {question.points} pts
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {question.text}
          </h3>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(question)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaEdit className="text-lg" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaQuestionCircle className="mr-2 text-blue-500" />
          <span className="font-medium">Quiz #{question.quizId}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <FaCheck className="mr-2 text-green-500" />
          Answer Options
        </h4>
        <div className="space-y-2">
          {question.answerOptions.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                option.isCorrect
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  option.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {option.isCorrect ? (
                  <FaCheck className="text-xs" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={`flex-1 text-sm ${
                  option.isCorrect
                    ? "text-green-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.text}
              </span>
              {option.isCorrect && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                  Correct
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminQuestions: React.FC = () => {
  const { questions, loading, error, deleteQuestion, fetchQuestions } =
    useAdminQuestions();
  const { quizzes } = useAdminQuizzes();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [pointsFilter, setPointsFilter] = useState<string>("all");
  const [quizFilter, setQuizFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || question.type === typeFilter;
    const matchesPoints =
      pointsFilter === "all" ||
      (pointsFilter === "low" && question.points <= 5) ||
      (pointsFilter === "medium" &&
        question.points > 5 &&
        question.points <= 10) ||
      (pointsFilter === "high" && question.points > 10);
    const matchesQuiz =
      quizFilter === "all" || question.quizId.toString() === quizFilter;

    return matchesSearch && matchesType && matchesPoints && matchesQuiz;
  });

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (questionData: any) => {
    try {
      console.log("📤 Full question data:", questionData);
      console.log("🎯 Quiz ID from form:", questionData.quizId);

      if (editingQuestion) {
        console.log("✏️ Updating question:", editingQuestion.id);
        await quizService.adminUpdateQuestion(editingQuestion.id, questionData);
      } else {
        const quizIdToUse = questionData.quizId;

        if (!quizIdToUse || quizIdToUse === 0) {
          alert("Please select a quiz");
          return;
        }

        console.log("🆕 Creating question for quiz:", quizIdToUse);

        const { ...payload } = questionData;

        console.log("📨 Final payload for API:", payload);

        await quizService.adminCreateQuestion(quizIdToUse, payload);
      }

      handleCloseModal();
      fetchQuestions();
    } catch (err: any) {
      console.error("❌ Error saving question:", err);
      console.error("❌ Error details:", err.response?.data);
      alert(
        "Failed to save question: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  const stats = {
    total: questions.length,
    singleChoice: questions.filter((q) => q.type === "SingleChoice").length,
    multipleChoice: questions.filter((q) => q.type === "MultipleChoice").length,
    trueFalse: questions.filter((q) => q.type === "TrueFalse").length,
    fillInBlank: questions.filter((q) => q.type === "FillInBlank").length,
    averagePoints:
      questions.length > 0
        ? Math.round(
            questions.reduce((sum, q) => sum + q.points, 0) / questions.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <FaTimes className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 ml-3">
                Error Loading Questions
              </h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Question Bank
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and organize all quiz questions
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleCreateQuestion}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Question
            </button>
            {quizFilter !== "all" && (
              <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                Adding to Quiz #{quizFilter}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.singleChoice}
            </div>
            <div className="text-sm text-gray-600">Single Choice</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.multipleChoice}
            </div>
            <div className="text-sm text-gray-600">Multi Choice</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {stats.trueFalse}
            </div>
            <div className="text-sm text-gray-600">True/False</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.fillInBlank}
            </div>
            <div className="text-sm text-gray-600">Fill in Blank</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averagePoints}
            </div>
            <div className="text-sm text-gray-600">Avg Points</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Questions
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="SingleChoice">Single Choice</option>
                <option value="MultipleChoice">Multiple Choice</option>
                <option value="TrueFalse">True/False</option>
                <option value="FillInBlank">Fill in Blank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Range
              </label>
              <select
                value={pointsFilter}
                onChange={(e) => setPointsFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Points</option>
                <option value="low">Low (1-5 pts)</option>
                <option value="medium">Medium (6-10 pts)</option>
                <option value="high">High (11+ pts)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz
              </label>
              <select
                value={quizFilter}
                onChange={(e) => setQuizFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Quizzes</option>
                {quizzes.map(
                  (
                    quiz: any
                  ) => (
                    <option key={quiz.id} value={quiz.id.toString()}>
                      Quiz #{quiz.id} - {quiz.title}{" "}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-gray-400 text-8xl mb-6">❓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {questions.length === 0
                  ? "No questions created yet"
                  : "No questions found"}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {questions.length === 0
                  ? "Start building your question bank by creating your first question."
                  : "Try adjusting your search terms or filters to find what you're looking for."}
              </p>
              {questions.length === 0 && (
                <button
                  onClick={handleCreateQuestion}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <FaPlus className="mr-3" />
                  Create Your First Question
                </button>
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={handleEditQuestion}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <QuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveQuestion}
          question={editingQuestion}
          quizId={quizFilter !== "all" ? parseInt(quizFilter) : undefined}
          quizzes={quizzes}
        />
      </div>
    </div>
  );
};

export default AdminQuestions;
