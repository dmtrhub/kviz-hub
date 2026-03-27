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
    return "from-blue-600 to-slate-700";
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
    <div className="surface-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
      {/* Header with unified styling */}
      <div className="rounded-xl -mx-2 -mt-2 mb-4 p-4 bg-blue-50 border-l-4 border-blue-500">
        <h2 className="text-xl font-bold text-slate-900 mb-1">{quiz.title}</h2>
        <p className="text-slate-700 text-sm line-clamp-2">{quiz.description}</p>
      </div>

      {/* Meta info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-slate-700 bg-blue-50 rounded-lg p-3">
          <FaQuestionCircle className="mr-3 text-blue-600" />
          <div>
            <div className="font-semibold">
              {quiz.questionCount ?? 0} questions
            </div>
            <div className="text-xs text-slate-600">Total questions</div>
          </div>
        </div>

        {quiz.timeLimit && (
          <div className="flex items-center text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
            <FaClock className="mr-3 text-slate-600" />
            <div>
              <div className="font-semibold">{quiz.timeLimit} minutes</div>
              <div className="text-xs text-slate-600">Time limit</div>
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
              className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 mt-auto pt-4 border-t border-slate-200">
        <button
          onClick={() => onEdit(quiz)}
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
      <div className="py-16 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="surface-card rounded-2xl p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Quizzes
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Quiz Management
            </h2>
            <p className="text-slate-600">
              Create, edit, and manage your quiz collection
            </p>
          </div>
          <button
            onClick={handleCreateQuiz}
            className="btn-primary px-6 py-3 rounded-xl flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Quiz
          </button>
        </div>

        {/* Search */}
        <div className="surface-card rounded-2xl p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quizzes by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

      {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full text-center py-20 surface-card rounded-2xl">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaQuestionCircle className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {quizzes.length === 0
                ? "No quizzes created yet"
                : "No quizzes found"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {quizzes.length === 0
                ? "Start building your quiz collection by creating your first engaging quiz."
                : "Try adjusting your search terms to find what you're looking for."}
            </p>
            {quizzes.length === 0 && (
              <button
                onClick={handleCreateQuiz}
                className="btn-primary px-6 py-3 rounded-xl inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Your First Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={handleEditQuiz}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

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
