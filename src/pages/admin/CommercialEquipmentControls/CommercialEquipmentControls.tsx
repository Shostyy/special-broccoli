import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { GeneralButton, SimpleTable, TradePointSelect, UpdateButton } from '../../../components/common';
import useTradePoints from './hooks/useTradePoints';
import { fetchControlByIdAsync, fetchControlHistoryAsync, resetState, updateCommercialEquipmentControls } from '../../../redux/slices/commercialEquipmentControlSlice';
import ControlHistoryTable from './components/ControlHistoryTable';
import ControlModal from './components/ControlModal';
import { TradePointData } from '../../../api/types/tradePointData';
import styles from './styles/CommercialEquipmentControl.module.css';
import { CommercialEquipmentControl } from '../../../api/types/commercialEquipmentControl';
import { CircularProgress } from '@mui/material';

const CommercialEquipmentControls: React.FC = () => {
    const dispatch = useAppDispatch();
    const tradePointsList = useAppSelector(state => state.tradePoints.tradePoints);
    const loading = useAppSelector(state => state.tradePoints.loading);
    const controlHistory = useAppSelector(state => state.commercialEquipmentControl.controlHistory);
    const controlById = useAppSelector(state => state.commercialEquipmentControl.controlById);
    const { updateStatus } = useAppSelector(state => state.commercialEquipmentControl);
    const [selectedTradePoint, setSelectedTradePoint] = useState<TradePointData | null>(null);
    const [selectedRow, setSelectedRow] = useState<CommercialEquipmentControl | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>('Counters');
    const [controlId, setControlId] = useState<string | ''>('');
    const [lastAction, setLastAction] = useState<'loadById' | 'loadByTradePoint' | null>(null);

    useTradePoints(tradePointsList);

    const handleUpdate = () => {
        if (selectedTradePoint) {
            dispatch(updateCommercialEquipmentControls(selectedTradePoint.id));
        }
    };

    const handleSelectTradePoint = (tradePoint: TradePointData | null) => {
        if (tradePoint) {
            setSelectedTradePoint(tradePoint);
            dispatch(fetchControlHistoryAsync({ tradePointId: tradePoint.id }));
            setLastAction('loadByTradePoint');
        }
    };

    const handleLoadControlById = (id: number) => {
        dispatch(fetchControlByIdAsync(id));
        setLastAction('loadById');
    };

    const handleButtonClick = () => {
        if (controlId) {
            handleLoadControlById(Number(controlId));
        }
    };

    const handleLoadByTradePoint = () => {
        if (selectedTradePoint) {
            dispatch(fetchControlHistoryAsync({ tradePointId: selectedTradePoint.id }));
            setLastAction('loadByTradePoint');
        }
    };

    const handleRowClick = (row: CommercialEquipmentControl) => {
        setSelectedRow(row);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedRow(null);
        setSelectedTab('Counters');
    };

    const handleTabChange = (newValue: string) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        return () => {
            dispatch(resetState());
        };
    }, [dispatch]);

    console.log(loading);

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <CircularProgress color='error' />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.flexContainer}>
                {/* Left Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {tradePointsList && tradePointsList.length > 0 && (
                        <TradePointSelect
                            tradePointsList={tradePointsList}
                            onSelect={handleSelectTradePoint}
                            color='white'
                            width={320}
                        />
                    )}
                    {/*
                    <GeneralButton
                        onClick={handleLoadByTradePoint}
                        translationKey='Завантажити по торговій точці'
                        width={280}
                    />
                    <input
                        className={styles.inputId}
                        type="text"
                        value={controlId}
                        onChange={(e) => setControlId(e.target.value)} // Update state on change
                        placeholder="ID контролю" // Optional placeholder
                    />
                    <GeneralButton
                        onClick={handleButtonClick}
                        translationKey='Завантажити по ID'
                        width={200}
                    />
                    */}

                </div>

                {/* Right Section */}
                <div style={{ marginLeft: 'auto' }}>
                    <UpdateButton
                        onClick={handleUpdate}
                        updateStatus={updateStatus}
                    />
                </div>
            </div>

            {/* Conditional Rendering */}
            {lastAction === 'loadById' && controlById && (
                <ControlModal
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    selectedRow={controlById} // Show control by ID
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}
                />
            )}
            {lastAction === 'loadByTradePoint' && controlHistory && (
                <ControlHistoryTable
                    controlHistory={controlHistory}
                    onRowClick={handleRowClick}
                />
            )}
            {selectedRow && (
                <ControlModal
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    selectedRow={selectedRow}
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}
                />
            )}
        </div>
    );
};

export default CommercialEquipmentControls;
