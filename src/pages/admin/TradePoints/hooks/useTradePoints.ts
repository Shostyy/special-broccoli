import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { fetchTradePointAsync, updateTradePoints } from '../../../../redux/slices/tradePointsSlice';

export const useTradePoints = () => {
    const dispatch = useAppDispatch();
    const {
        tradePoints,
        updateStatus,
        loading,
    } = useAppSelector(state => state.tradePoints);

    useEffect(() => {
        if (!tradePoints) {
            dispatch(fetchTradePointAsync());
        }
    }, [dispatch]);

    const handleUpdate = () => {
        dispatch(updateTradePoints());
    };

    return { tradePoints, updateStatus, handleUpdate, loading };
};