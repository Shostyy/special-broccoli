import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { fetchProductsAsync, updateProducts } from '../../../../redux/slices/productsSlice';

export const useProducts = () => {
    const dispatch = useAppDispatch();
    const {
        products,
        updateStatus,
        loading,
    } = useAppSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProductsAsync());
    }, [dispatch]);

    const handleUpdate = () => {
        dispatch(updateProducts());
    };

    return { products, updateStatus, handleUpdate, loading };
};