import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import type { Quiz } from "../../models/Quiz";
import type { Category } from "../../models/Category";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quizData: any) => void;
  quiz?: Quiz | null;
  categories: Category[];
}

// Difficulty enum koji odgovara serveru
enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onSave,
  quiz,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    difficulty: Difficulty.Medium,
    categoryIds: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quiz) {
      const difficultyEnum =
        quiz.difficulty === "Easy"
          ? Difficulty.Easy
          : quiz.difficulty === "Medium"
          ? Difficulty.Medium
          : Difficulty.Hard;

      setFormData({
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit || 30,
        difficulty: difficultyEnum,
        categoryIds: quiz.categories?.map((cat) => cat.id) || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        timeLimit: 30,
        difficulty: Difficulty.Medium,
        categoryIds: [],
      });
    }
    setErrors({});
  }, [quiz, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.timeLimit < 1) {
      newErrors.timeLimit = "Time limit must be at least 1 minute";
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      timeLimit: formData.timeLimit,
      difficulty: formData.difficulty,
      categoryIds: formData.categoryIds,
    };

    console.log("📤 Sending quiz data to server:", payload);
    onSave(payload);
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleTimeLimitChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      timeLimit: Math.max(1, Math.min(180, value)),
    }));
  };

  const handleDifficultyChange = (value: string) => {
    const difficultyEnum =
      value === "Easy"
        ? Difficulty.Easy
        : value === "Medium"
        ? Difficulty.Medium
        : Difficulty.Hard;

    setFormData((prev) => ({
      ...prev,
      difficulty: difficultyEnum,
    }));
  };

  const getDifficultyString = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.Easy:
        return "Easy";
      case Difficulty.Medium:
        return "Medium";
      case Difficulty.Hard:
        return "Hard";
      default:
        return "Medium";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {quiz ? "Edit Quiz" : "Create New Quiz"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter quiz title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Describe what this quiz is about..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Time Limit & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes) *
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleTimeLimitChange(formData.timeLimit - 5)}
                  disabled={formData.timeLimit <= 5}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    handleTimeLimitChange(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  max="180"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center ${
                    errors.timeLimit ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleTimeLimitChange(formData.timeLimit + 5)}
                  disabled={formData.timeLimit >= 180}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {errors.timeLimit && (
                <p className="mt-1 text-sm text-red-600">{errors.timeLimit}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                value={getDifficultyString(formData.difficulty)}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-3 border border-gray-300 rounded-xl">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No categories available
                </p>
              ) : (
                categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))
              )}
            </div>
            {errors.categoryIds && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryIds}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center"
            >
              <FaSave className="mr-2" />
              {quiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
