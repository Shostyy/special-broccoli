import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import {
    clearRemains,
    fetchProductRemainsAsync,
    updateProductRemains
} from '../../../../redux/slices/productsRemains';
import { fetchBranchOfficesAsync } from '../../../../redux/slices/branchOfficesSlice';
import { BranchOffice } from '../../../../api/types/branchOffice';
import { ProductsRemain } from '../../../../api/types/productsRemain';

export const useProductRemains = () => {
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    const { productRemains, updateStatus, loading } = useAppSelector(state => state.productRemain);
    const branchOffices = useAppSelector(state => state.branchOffices.branchOffices);

    useEffect(() => {
        dispatch(fetchBranchOfficesAsync());
    }, [dispatch]);

    const handleBranchOfficeChange = (branchOffice: BranchOffice | null) => {
        if (branchOffice) {
            setSelectedBranchOffice(branchOffice.id);
            dispatch(fetchProductRemainsAsync(branchOffice.id));
        } else {
            setSelectedBranchOffice(null);
            dispatch(clearRemains());
        }
    };

    const handleUpdate = () => {
        if (selectedBranchOffice) {
            dispatch(updateProductRemains(selectedBranchOffice));
        }
    };

    const rowsWithId: ProductsRemain[] | null = productRemains
        ? productRemains.map(product => ({
            ...product,
            id: product.productId,
        }))
        : null;

    return {
        productRemains: rowsWithId,
        updateStatus,
        handleUpdate,
        loading,
        branchOffices,
        handleBranchOfficeChange,
        selectedBranchOffice
    };
};