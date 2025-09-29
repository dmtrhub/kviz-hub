import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaQuestionCircle,
  FaClock,
} from "react-icons/fa";
import { useAdminQuizzes } from "../../hooks/useAdminQuizzes";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import QuizModal from "./QuizModal";
import type { Quiz } from "../../models/Quiz";

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onEdit, onDelete }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getQuizGradient = () => {
    return "from-blue-600 to-purple-600";
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`
      )
    ) {
      onDelete(quiz.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col border border-gray-100">
      {/* Header with unified gradient */}
      <div
        className={`bg-gradient-to-r ${getQuizGradient()} rounded-xl -mx-2 -mt-2 mb-4 p-4 text-white`}
      >
        <h2 className="text-xl font-bold mb-1">{quiz.title}</h2>
        <p className="text-white/90 text-sm line-clamp-2">{quiz.description}</p>
      </div>

      {/* Meta info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <FaQuestionCircle className="mr-3 text-blue-500" />
          <div>
            <div className="font-semibold">
              {quiz.questionCount ?? 0} questions
            </div>
            <div className="text-xs text-gray-500">Total questions</div>
          </div>
        </div>

        {quiz.timeLimit && (
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <FaClock className="mr-3 text-purple-500" />
            <div>
              <div className="font-semibold">{quiz.timeLimit} minutes</div>
              <div className="text-xs text-gray-500">Time limit</div>
            </div>
          </div>
        )}
      </div>

      {/* Difficulty and Categories */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {quiz.categories?.map((cat) => (
            <span
              key={cat.id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(quiz)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm text-center shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <FaEdit className="mr-2" />
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm text-center shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <FaTrash className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

const AdminQuizzes: React.FC = () => {
  const { quizzes, loading, error, deleteQuiz, createQuiz, updateQuiz } =
    useAdminQuizzes();
  const { categories } = useAdminCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const handleSaveQuiz = async (quizData: any) => {
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, quizData);
      } else {
        await createQuiz(quizData);
      }
      handleCloseModal();
    } catch (err) {
      alert("Failed to save quiz");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuiz(id);
    } catch (err) {
      alert("Failed to delete quiz");
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.categories?.some((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading quizzes...</p>
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
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 ml-3">
                Error Loading Quizzes
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Quiz Management
            </h1>
            <p className="text-gray-600 text-lg">
              Create, edit, and manage your quiz collection
            </p>
          </div>
          <button
            onClick={handleCreateQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Quiz
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-gray-400 text-8xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {quizzes.length === 0
                  ? "No quizzes created yet"
                  : "No quizzes found"}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {quizzes.length === 0
                  ? "Start building your quiz collection by creating your first engaging quiz."
                  : "Try adjusting your search terms to find what you're looking for."}
              </p>
              {quizzes.length === 0 && (
                <button
                  onClick={handleCreateQuiz}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <FaPlus className="mr-3" />
                  Create Your First Quiz
                </button>
              )}
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={handleEditQuiz}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Modal */}
        <QuizModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveQuiz}
          quiz={editingQuiz}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default AdminQuizzes;
