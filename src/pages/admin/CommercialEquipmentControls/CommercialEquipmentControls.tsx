import React from 'react';
import { TradePointSelect, UpdateButton } from '../../../components/common';
import ControlHistoryTable from './components/ControlHistoryTable';
import ControlModal from './components/ControlModal';
import styles from './styles/CommercialEquipmentControl.module.css';
import { CircularProgress } from '@mui/material';
import useCommercialEquipmentControls from './hooks/useCommercialEquipmentControls';

const CommercialEquipmentControls: React.FC = () => {
    const {
        tradePointsList,
        loading,
        controlHistory,
        updateStatus,
        selectedRow,
        isPopupOpen,
        selectedTab,
        handleUpdate,
        handleSelectTradePoint,
        handleRowClick,
        handleClosePopup,
        handleTabChange
    } = useCommercialEquipmentControls();

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
                <div className={styles.controlButtonsWrapper}>
                    {tradePointsList && tradePointsList.length > 0 && (
                        <TradePointSelect
                            tradePointsList={tradePointsList}
                            onSelect={handleSelectTradePoint}
                            color='white'
                            width={320}
                        />
                    )}
                </div>
                <UpdateButton
                    onClick={handleUpdate}
                    updateStatus={updateStatus}
                />
            </div>
            {controlHistory && (
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