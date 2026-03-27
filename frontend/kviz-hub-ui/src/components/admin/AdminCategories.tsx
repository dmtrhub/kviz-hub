import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaFolder,
} from "react-icons/fa";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import { quizService } from "../../services/QuizService";
import CategoryModal from "./CategoryModal";
import type { Category } from "../../models/Category";

interface CategoryCardProps {
  category: Category;
  quizCount: number;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  quizCount,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div className="surface-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2.5 rounded-lg">
              <FaFolder className="text-blue-700 text-base" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            {category.description}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(category)}
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

      {/* Stats */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <div className="text-center">
          <div className="text-xl font-bold text-slate-900">{quizCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Quizzes</div>
        </div>
      </div>
    </div>
  );
};

const AdminCategories: React.FC = () => {
  const { categories, loading, error, deleteCategory, fetchCategories } =
    useAdminCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryQuizCounts, setCategoryQuizCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadCategoryQuizCounts = async () => {
      try {
        const quizzes = await quizService.adminGetAllQuizzes();
        const counts: Record<number, number> = {};

        for (const quiz of quizzes) {
          for (const cat of quiz.categories ?? []) {
            counts[cat.id] = (counts[cat.id] ?? 0) + 1;
          }
        }

        setCategoryQuizCounts(counts);
      } catch (err) {
        console.error("Error loading category quiz counts:", err);
      }
    };

    loadCategoryQuizCounts();
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      console.log("📤 Saving category data:", categoryData);

      if (editingCategory) {
        console.log("✏️ Updating category:", editingCategory.id);
        await quizService.adminUpdateCategory(editingCategory.id, categoryData);
      } else {
        console.log("🆕 Creating category");
        await quizService.adminCreateCategory(categoryData);
      }

      handleCloseModal();
      fetchCategories();

      const quizzes = await quizService.adminGetAllQuizzes();
      const counts: Record<number, number> = {};
      for (const quiz of quizzes) {
        for (const cat of quiz.categories ?? []) {
          counts[cat.id] = (counts[cat.id] ?? 0) + 1;
        }
      }
      setCategoryQuizCounts(counts);
    } catch (err: any) {
      console.error("❌ Error saving category:", err);
      console.error("❌ Error details:", err.response?.data);
      alert(
        "Failed to save category: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);

      const quizzes = await quizService.adminGetAllQuizzes();
      const counts: Record<number, number> = {};
      for (const quiz of quizzes) {
        for (const cat of quiz.categories ?? []) {
          counts[cat.id] = (counts[cat.id] ?? 0) + 1;
        }
      }
      setCategoryQuizCounts(counts);
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  // Statistics
  const stats = {
    total: categories.length,
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="surface-card rounded-2xl p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Categories
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
              Categories
            </h2>
            <p className="text-slate-600">
              Organize and manage quiz categories
            </p>
          </div>
          <button
            onClick={handleCreateCategory}
            className="btn-primary px-6 py-3 rounded-xl flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Category
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 mb-8">
          <div className="surface-card rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Categories</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaFolder className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="surface-card rounded-2xl p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="col-span-full text-center py-20 surface-card rounded-2xl">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaFolder className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {categories.length === 0
                ? "No categories created yet"
                : "No categories found"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {categories.length === 0
                ? "Start organizing your quizzes by creating your first category."
                : "Try adjusting your search terms to find what you're looking for."}
            </p>
            {categories.length === 0 && (
              <button
                onClick={handleCreateCategory}
                className="btn-primary px-6 py-3 rounded-xl inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Your First Category
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                quizCount={categoryQuizCounts[category.id] ?? 0}
                onEdit={handleEditCategory}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
          category={editingCategory}
        />
      </div>
    </div>
  );
};

export default AdminCategories;
