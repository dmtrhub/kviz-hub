import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import type { Category } from '../models/Category';

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: any): Promise<Category> => {
    const newCategory = await adminApi.createCategory(categoryData);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = async (id: number, categoryData: any): Promise<Category> => {
    const updatedCategory = await adminApi.updateCategory(id, categoryData);
    setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
    return updatedCategory;
  };

  const deleteCategory = async (id: number): Promise<void> => {
    await adminApi.deleteCategory(id);
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};