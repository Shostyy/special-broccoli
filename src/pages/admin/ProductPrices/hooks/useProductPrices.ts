import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import {
    fetchProductPricesAsync,
    setSelectedTradePoint,
    updateProductPrices
} from '../../../../redux/slices/productPricesSlice';
import { fetchTradePointAsync } from '../../../../redux/slices/tradePointsSlice';
import { TradePointData } from '../../../../api/types/tradePointData';

export const useProductPrices = () => {
    const dispatch = useAppDispatch();
    const {
        productPrices,
        updateStatus,
        selectedTradePoint,
        loading,
    } = useAppSelector(state => state.prices);
    const tradePointsList = useAppSelector(state => state.tradePoints.tradePoints);

    useEffect(() => {
        if (!tradePointsList) {
            dispatch(fetchTradePointAsync());
        }
    }, [dispatch, tradePointsList]);

    useEffect(() => {
        if (selectedTradePoint) {
            dispatch(fetchProductPricesAsync(selectedTradePoint.id));
        }
    }, [selectedTradePoint, dispatch]);

    const handleSelectTradePoint = (tradePoint: TradePointData | null) => {
        if (tradePoint) {
            dispatch(setSelectedTradePoint(tradePoint));
        }
    };

    const handleUpdate = () => {
        if (selectedTradePoint) {
            dispatch(updateProductPrices(selectedTradePoint.id));
        }
    };

    return {
        productPrices,
        updateStatus,
        handleUpdate,
        loading,
        tradePointsList,
        handleSelectTradePoint,
        selectedTradePoint
    };
};