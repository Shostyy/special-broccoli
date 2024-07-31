import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { fetchControlHistoryAsync, resetState, updateCommercialEquipmentControls } from '../../../../redux/slices/commercialEquipmentControlSlice';
import { TradePointData } from '../../../../api/types/tradePointData';
import { CommercialEquipmentControl } from '../../../../api/types/commercialEquipmentControl';
import useTradePoints from './useTradePoints';

const useCommercialEquipmentControls = () => {
    const dispatch = useAppDispatch();
    const tradePointsList = useAppSelector(state => state.tradePoints.tradePoints);
    const loading = useAppSelector(state => state.tradePoints.loading);
    const controlHistory = useAppSelector(state => state.commercialEquipmentControl.controlHistory);
    const { updateStatus } = useAppSelector(state => state.commercialEquipmentControl);
    const [selectedTradePoint, setSelectedTradePoint] = useState<TradePointData | null>(null);
    const [selectedRow, setSelectedRow] = useState<CommercialEquipmentControl | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>('Counters');

    useTradePoints(tradePointsList);

    useEffect(() => {
        return () => {
            dispatch(resetState());
        };
    }, [dispatch]);

    const handleUpdate = useCallback(() => {
        if (selectedTradePoint) {
            dispatch(updateCommercialEquipmentControls(selectedTradePoint.id));
        }
    }, [dispatch, selectedTradePoint]);

    const handleSelectTradePoint = useCallback((tradePoint: TradePointData | null) => {
        if (tradePoint) {
            setSelectedTradePoint(tradePoint);
            dispatch(fetchControlHistoryAsync({ tradePointId: tradePoint.id }));
        }
    }, [dispatch]);

    const handleRowClick = useCallback((row: CommercialEquipmentControl) => {
        setSelectedRow(row);
        setIsPopupOpen(true);
    }, []);

    const handleClosePopup = useCallback(() => {
        setIsPopupOpen(false);
        setSelectedRow(null);
        setSelectedTab('Counters');
    }, []);

    const handleTabChange = useCallback((newValue: string) => {
        setSelectedTab(newValue);
    }, []);

    return {
        tradePointsList,
        loading,
        controlHistory,
        updateStatus,
        selectedTradePoint,
        selectedRow,
        isPopupOpen,
        selectedTab,
        handleUpdate,
        handleSelectTradePoint,
        handleRowClick,
        handleClosePopup,
        handleTabChange
    };
};

export default useCommercialEquipmentControls;