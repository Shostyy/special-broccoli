import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { useTradePointColumns } from '../hooks/useTradePointColumns';
import { TradePointData } from '../../../../api/types/tradePointData';

interface TradePointsTableProps {
    items: TradePointData[];
}

const TradePointsTable: React.FC<TradePointsTableProps> = ({ items }) => {
    const columns = useTradePointColumns();

    return (
        <SimpleTable
            columns={columns}
            rows={items}
            customRowHeight={53}
        />
    );
};

export default TradePointsTable;