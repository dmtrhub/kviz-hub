import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaFolder,
  FaChartBar,
} from "react-icons/fa";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import { quizService } from "../../services/QuizService";
import CategoryModal from "./CategoryModal";
import type { Category } from "../../models/Category";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <FaFolder className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {category.description}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(category)}
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Quizzes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600">Questions</div>
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
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  // Statistics
  const stats = {
    total: categories.length,
    averageNameLength:
      categories.length > 0
        ? Math.round(
            categories.reduce((sum, cat) => sum + cat.name.length, 0) /
              categories.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading categories...</p>
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
                Error Loading Categories
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
              Categories
            </h1>
            <p className="text-gray-600 text-lg">
              Organize and manage quiz categories
            </p>
          </div>
          <button
            onClick={handleCreateCategory}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Category
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaFolder className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl">
                <FaChartBar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Name Length
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageNameLength}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Search Categories
            </h3>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by category name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-gray-400 text-8xl mb-6">📁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {categories.length === 0
                  ? "No categories created yet"
                  : "No categories found"}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {categories.length === 0
                  ? "Start organizing your quizzes by creating your first category."
                  : "Try adjusting your search terms to find what you're looking for."}
              </p>
              {categories.length === 0 && (
                <button
                  onClick={handleCreateCategory}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <FaPlus className="mr-3" />
                  Create Your First Category
                </button>
              )}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

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
