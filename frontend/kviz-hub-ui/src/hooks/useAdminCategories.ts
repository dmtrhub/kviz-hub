import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import type { Category } from '../models/Category';
import { useAsyncStatus } from './useAsyncStatus';

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });

  const fetchCategories = async () => {
    const data = await execute(() => adminApi.getAllCategories(), {
      errorMessage: 'Failed to fetch categories',
    });

    if (data) {
      setCategories(data);
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