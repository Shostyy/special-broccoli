import { useEffect } from 'react';
import { fetchBranchOfficesAsync, updateBranchOffices } from '../../../../redux/slices/branchOfficesSlice';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';

export const useBranchOffices = () => {
  const dispatch = useAppDispatch();
  const {
    branchOffices,
    updateStatus,
    loading,
  } = useAppSelector((state) => state.branchOffices);

  useEffect(() => {
    dispatch(fetchBranchOfficesAsync());
  }, [dispatch]);

  const handleUpdateClick = () => {
    dispatch(updateBranchOffices());
  };

  return { branchOffices, updateStatus, handleUpdateClick, loading };
};