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
        return "bg-slate-100 text-slate-800 border border-slate-200";
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
    <div className="surface-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
      <div className="flex items-center space-x-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(
                question.type
              )}`}
            >
              {getTypeLabel(question.type)}
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-200">
              {question.points} pts
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 leading-relaxed">
            {question.text}
          </h3>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(question)}
            className="bg-gradient-to-r from-blue-500 to-slate-700 text-white p-2.5 rounded-lg transition-all duration-200 shadow-sm hover:from-blue-600 hover:to-slate-800 hover:shadow-md"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-3 mb-4">
        <div className="flex items-center text-sm text-slate-700">
          <FaQuestionCircle className="mr-2 text-blue-600" />
          <span className="font-medium">Quiz #{question.quizId}</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
          <FaCheck className="mr-2 text-green-600" />
          Answer Options
        </h4>
        <div className="space-y-2">
          {question.answerOptions.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                option.isCorrect
                  ? "bg-green-100 border-2 border-green-300 shadow-sm"
                  : "bg-white border border-slate-300"
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
                    ? "text-green-900 font-medium"
                    : "text-slate-700"
                }`}
              >
                {option.text}
              </span>
              {option.isCorrect && (
                <span className="bg-green-200 text-green-900 text-xs px-2 py-1 rounded-full font-semibold ml-2">
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
      <div className="py-16 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="surface-card rounded-2xl p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Questions
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Question Bank
            </h2>
            <p className="text-slate-600">
              Manage and organize all quiz questions
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleCreateQuestion}
              className="btn-primary px-6 py-3 rounded-xl flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Question
            </button>
            {quizFilter !== "all" && (
              <span className="text-sm text-slate-700 bg-blue-200 px-3 py-1 rounded-full">
                Adding to Quiz #{quizFilter}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-slate-900">
              {stats.total}
            </div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.singleChoice}
            </div>
            <div className="text-sm text-slate-600">Single Choice</div>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-slate-700">
              {stats.multipleChoice}
            </div>
            <div className="text-sm text-slate-600">Multi Choice</div>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.trueFalse}
            </div>
            <div className="text-sm text-slate-600">True/False</div>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.fillInBlank}
            </div>
            <div className="text-sm text-slate-600">Fill in Blank</div>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averagePoints}
            </div>
            <div className="text-sm text-slate-600">Avg Points</div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <FaFilter className="text-slate-600 mr-2" />
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Questions
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Question Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="SingleChoice">Single Choice</option>
                <option value="MultipleChoice">Multiple Choice</option>
                <option value="TrueFalse">True/False</option>
                <option value="FillInBlank">Fill in Blank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Points Range
              </label>
              <select
                value={pointsFilter}
                onChange={(e) => setPointsFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Points</option>
                <option value="low">Low (1-5 pts)</option>
                <option value="medium">Medium (6-10 pts)</option>
                <option value="high">High (11+ pts)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quiz
              </label>
              <select
                value={quizFilter}
                onChange={(e) => setQuizFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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

        <div className="grid gap-6">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full text-center py-20 surface-card rounded-2xl">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaQuestionCircle className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {questions.length === 0
                  ? "No questions created yet"
                  : "No questions found"}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {questions.length === 0
                  ? "Start building your question bank by creating your first question."
                  : "Try adjusting your search terms or filters to find what you're looking for."}
              </p>
              {questions.length === 0 && (
                <button
                  onClick={handleCreateQuestion}
                  className="btn-primary px-6 py-3 rounded-xl inline-flex items-center"
                >
                  <FaPlus className="mr-2" />
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
