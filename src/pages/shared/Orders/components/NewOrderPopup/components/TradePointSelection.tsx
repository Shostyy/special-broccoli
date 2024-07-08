import React from 'react';
import styles from '../styles/styles.module.css';
import { useTranslation } from 'react-i18next';
import { TradePointData } from '../../../../../../api/types/tradePointData';
import { TradePointSelect } from '../../../../../../components/common';
import { OrderData } from '../../../../../../api/types/orderData';

interface TradePointSelectionProps {
    selectedTradePoint: TradePointData | null;
    tradePointsForOrders: TradePointData[];
    onSelect: (tradePoint: TradePointData | null) => void;
    editOrder?: OrderData | null;
    copyOrder?: OrderData | null;
}

const TradePointSelection: React.FC<TradePointSelectionProps> = ({
    selectedTradePoint,
    tradePointsForOrders,
    onSelect,
    editOrder,
    copyOrder
}) => {
    const { t } = useTranslation();

    if (editOrder || copyOrder) {
        return (
            <div className={styles.selectedTradePoint}>
                {selectedTradePoint?.name || t('NoTradePointSelected')}
            </div>
        );
    }

    if (tradePointsForOrders.length === 1) {
        return (
            <div className={styles.selectedTradePoint}>
                {tradePointsForOrders[0]?.name || t('NoTradePointSelected')}
            </div>
        );
    }

    return (
        <TradePointSelect
            tradePointsList={tradePointsForOrders}
            onSelect={onSelect}
            width={270}
            height={56}
        />
    );
};

export default TradePointSelection;