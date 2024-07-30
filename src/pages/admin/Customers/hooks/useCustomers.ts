import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { 
  fetchCustomersAsync, 
  updateCustomers 
} from '../../../../redux/slices/customersSlice';

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const {
    customers,
    updateStatus,
    loading,
  } = useAppSelector(state => state.customers);

  useEffect(() => {
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateCustomers());
  };

  return { customers, updateStatus, handleUpdate, loading };
};