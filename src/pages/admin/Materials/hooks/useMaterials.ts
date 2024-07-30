import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { 
  fetchMaterialsAsync, 
  updateMaterials 
} from '../../../../redux/slices/materialsSlice';

export const useMaterials = () => {
  const dispatch = useAppDispatch();
  const {
    materials,
    updateStatus,
    loading,
  } = useAppSelector(state => state.materials);

  useEffect(() => {
    dispatch(fetchMaterialsAsync());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateMaterials());
  };

  return { materials, updateStatus, handleUpdate, loading };
};