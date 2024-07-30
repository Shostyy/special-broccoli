import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { 
  fetchModelsAsync, 
  updateModels 
} from '../../../../redux/slices/modelSlice';

export const useModels = () => {
  const dispatch = useAppDispatch();
  const {
    models,
    updateStatus,
    loading,
  } = useAppSelector(state => state.models);

  useEffect(() => {
    dispatch(fetchModelsAsync());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateModels());
  };

  return { models, updateStatus, handleUpdate, loading };
};