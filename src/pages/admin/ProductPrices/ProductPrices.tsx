import React from 'react';
import { HandbookPage, TradePointSelect } from '../../../components/common';
import { useProductPrices } from './hooks/useProductPrices';
import ProductPricesTable from './components/ProductPricesTable';

const ProductPrices: React.FC = () => {
    const {
        productPrices,
        updateStatus,
        handleUpdate,
        loading,
        tradePointsList,
        handleSelectTradePoint,
    } = useProductPrices();

    return (
        <HandbookPage
            items={productPrices}
            loading={loading}
            updateStatus={updateStatus}
            handleUpdate={handleUpdate}
            TableComponent={ProductPricesTable}
            leftSideControls={
                tradePointsList && (
                    <TradePointSelect
                        tradePointsList={tradePointsList}
                        onSelect={handleSelectTradePoint}
                        color="white"
                    />
                )
            }
        />
    );
};

export default ProductPrices;