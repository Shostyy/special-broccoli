import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import {
    fetchCommercialEquipmentAsync,
    updateCommercialEquipment
} from '../../../../redux/slices/commercialEquipmentSlice';

export const useCommercialEquipment = () => {
    const dispatch = useAppDispatch();
    const {
        commercialEquipment,
        updateStatus,
        loading,
    } = useAppSelector(state => state.commercialEquipment);

    useEffect(() => {
        dispatch(fetchCommercialEquipmentAsync());
    }, [dispatch]);

    const handleUpdate = () => {
        dispatch(updateCommercialEquipment());
    };

    return { commercialEquipment, updateStatus, handleUpdate, loading };
};