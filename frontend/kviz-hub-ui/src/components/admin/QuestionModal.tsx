import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import type {
  Question,
  AnswerOption,
  QuestionType,
} from "../../models/Question";
import type { Quiz } from "../../models/Quiz";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: any) => void;
  question?: Question | null;
  quizId?: number;
  quizzes: Quiz[];
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  question,
  quizId,
  quizzes,
}) => {
  const [formData, setFormData] = useState({
    text: "",
    type: "SingleChoice" as QuestionType,
    points: 1,
    quizId: quizId || (quizzes.length > 0 ? quizzes[0].id : 0),
    answerOptions: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false },
    ] as AnswerOption[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nextOptionId, setNextOptionId] = useState(5);

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text,
        type: question.type,
        points: question.points,
        quizId: question.quizId,
        answerOptions: question.answerOptions.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect || false,
        })),
      });
      const maxId = Math.max(...question.answerOptions.map((opt) => opt.id), 0);
      setNextOptionId(maxId + 1);
    } else {
      setFormData({
        text: "",
        type: "SingleChoice",
        points: 1,
        quizId: quizId || (quizzes.length > 0 ? quizzes[0].id : 0),
        answerOptions: [
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ],
      });
      setNextOptionId(5);
    }
    setErrors({});
  }, [question, quizId, quizzes, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = "Question text is required";
    }

    if (formData.points < 1) {
      newErrors.points = "Points must be at least 1";
    }

    if (formData.quizId === 0) {
      newErrors.quizId = "Please select a quiz";
    }

    if (formData.type !== "FillInBlank") {
      const validOptions = formData.answerOptions.filter(
        (opt) => opt.text.trim() !== ""
      );

      if (validOptions.length < 2) {
        newErrors.answerOptions = "At least 2 answer options are required";
      }

      const correctOptions = validOptions.filter((opt) => opt.isCorrect);

      if (formData.type === "SingleChoice" && correctOptions.length !== 1) {
        newErrors.answerOptions =
          "Single choice questions must have exactly one correct answer";
      }

      if (formData.type === "MultipleChoice" && correctOptions.length < 1) {
        newErrors.answerOptions =
          "Multiple choice questions must have at least one correct answer";
      }

      if (formData.type === "TrueFalse" && correctOptions.length !== 1) {
        newErrors.answerOptions =
          "True/False questions must have one correct answer";
      }
    } else {
      const correctOption = formData.answerOptions.find((opt) => opt.isCorrect);
      if (!correctOption?.text.trim()) {
        newErrors.answerOptions =
          "Fill in blank questions require a correct answer";
      }
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
      text: formData.text.trim(),
      type: formData.type,
      points: formData.points,
      answerOptions: formData.answerOptions
        .filter((opt) => opt.text.trim() !== "")
        .map((opt) => ({
          text: opt.text.trim(),
          isCorrect: opt.isCorrect || false,
        })),
    };

    console.log("🎯 Selected quiz ID:", formData.quizId);
    console.log("📨 Question payload:", JSON.stringify(payload, null, 2));

    onSave({
      ...payload,
      quizId: formData.quizId,
    });
  };

  const handleAnswerOptionChange = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      answerOptions: prev.answerOptions.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const handleCorrectAnswerChange = (id: number) => {
    setFormData((prev) => {
      const optionIndex = prev.answerOptions.findIndex((opt) => opt.id === id);
      let newOptions = [...prev.answerOptions];

      if (prev.type === "SingleChoice" || prev.type === "TrueFalse") {
        newOptions = newOptions.map((opt) => ({
          ...opt,
          isCorrect: opt.id === id,
        }));
      } else if (prev.type === "MultipleChoice") {
        newOptions[optionIndex] = {
          ...newOptions[optionIndex],
          isCorrect: !newOptions[optionIndex].isCorrect,
        };
      } else if (prev.type === "FillInBlank") {
        newOptions = newOptions.map((opt) => ({
          ...opt,
          isCorrect: opt.id === id,
        }));
      }

      return { ...prev, answerOptions: newOptions };
    });
  };

  const addAnswerOption = () => {
    setFormData((prev) => ({
      ...prev,
      answerOptions: [
        ...prev.answerOptions,
        { id: nextOptionId, text: "", isCorrect: false },
      ],
    }));
    setNextOptionId((prev) => prev + 1);
  };

  const removeAnswerOption = (id: number) => {
    if (formData.answerOptions.length > 2) {
      setFormData((prev) => ({
        ...prev,
        answerOptions: prev.answerOptions.filter((opt) => opt.id !== id),
      }));
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    setFormData((prev) => {
      let newOptions = [...prev.answerOptions];

      if (
        newType === "SingleChoice" ||
        newType === "TrueFalse" ||
        newType === "FillInBlank"
      ) {
        newOptions = newOptions.map((opt) => ({ ...opt, isCorrect: false }));
      }

      if (newType === "TrueFalse") {
        newOptions = [
          { id: 1, text: "True", isCorrect: false },
          { id: 2, text: "False", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ];
        setNextOptionId(5);
      }

      return {
        ...prev,
        type: newType,
        answerOptions: newOptions,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {question ? "Edit Question" : "Create New Question"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quiz Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Quiz *
            </label>
            <select
              value={formData.quizId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quizId: parseInt(e.target.value),
                }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quizId ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value={0}>Select a quiz...</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  Quiz #{quiz.id} - {quiz.title}
                </option>
              ))}
            </select>
            {errors.quizId && (
              <p className="mt-1 text-sm text-red-600">{errors.quizId}</p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "SingleChoice", label: "Single Choice", icon: "🔘" },
                {
                  value: "MultipleChoice",
                  label: "Multiple Choice",
                  icon: "☑️",
                },
                { value: "TrueFalse", label: "True/False", icon: "✅" },
                { value: "FillInBlank", label: "Fill in Blank", icon: "📝" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value as QuestionType)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, text: e.target.value }))
              }
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.text ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your question..."
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>

          {/* Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points *
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      points: Math.max(1, prev.points - 1),
                    }))
                  }
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  -
                </button>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      points: parseInt(e.target.value) || 1,
                    }))
                  }
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      points: prev.points + 1,
                    }))
                  }
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  +
                </button>
              </div>
              {errors.points && (
                <p className="mt-1 text-sm text-red-600">{errors.points}</p>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options *
              </label>
              {formData.type !== "TrueFalse" && (
                <button
                  type="button"
                  onClick={addAnswerOption}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FaPlus className="mr-1" />
                  Add Option
                </button>
              )}
            </div>

            <div className="space-y-3">
              {formData.answerOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type={
                      formData.type === "MultipleChoice" ? "checkbox" : "radio"
                    }
                    checked={option.isCorrect || false}
                    onChange={() => handleCorrectAnswerChange(option.id)}
                    className={`${
                      formData.type === "MultipleChoice"
                        ? "rounded text-blue-600"
                        : "text-blue-600"
                    }`}
                    disabled={!option.text.trim()}
                  />

                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleAnswerOptionChange(
                        option.id,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Enter answer option..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={
                      formData.type === "TrueFalse" &&
                      (option.text === "True" || option.text === "False")
                    }
                  />

                  {formData.type !== "TrueFalse" &&
                    formData.answerOptions.length > 2 &&
                    option.text !== "True" &&
                    option.text !== "False" && (
                      <button
                        type="button"
                        onClick={() => removeAnswerOption(option.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <FaTrash />
                      </button>
                    )}
                </div>
              ))}
            </div>

            {errors.answerOptions && (
              <p className="mt-1 text-sm text-red-600">
                {errors.answerOptions}
              </p>
            )}

            <div className="mt-3 text-sm text-gray-500">
              {formData.type === "SingleChoice" && "Select one correct answer"}
              {formData.type === "MultipleChoice" &&
                "Select one or more correct answers"}
              {formData.type === "TrueFalse" && "Select the correct statement"}
              {formData.type === "FillInBlank" &&
                "Enter the correct answer (users will fill this in)"}
            </div>
          </div>

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
              {question ? "Update Question" : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
