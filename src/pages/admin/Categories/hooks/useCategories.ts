import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { fetchCategoriesAsync, updateCategories } from '../../../../redux/slices/categoriesSlice';

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    updateStatus,
    loading,
  } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateCategories());
  };

  return { categories, updateStatus, handleUpdate, loading };
};