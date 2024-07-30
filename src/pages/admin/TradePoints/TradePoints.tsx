import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useTradePoints } from './hooks/useTradePoints';
import TradePointsTable from './components/TradePointTable';

const TradePoints: React.FC = () => {
  const { tradePoints, updateStatus, handleUpdate, loading } = useTradePoints();

  return (
    <HandbookPage
      items={tradePoints}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={TradePointsTable}
    />
  );
};

export default TradePoints;