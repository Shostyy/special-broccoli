import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchProductPricesAsync, setSelectedTradePoint, updateProductPrices } from '../../../redux/slices/productPricesSlice';
import { SimpleTable, TradePointSelect, UpdateButton } from '../../../components/common';
import { TradePointData } from '../../../api/types/tradePointData';
import { Box, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchTradePointAsync } from '../../../redux/slices/tradePointsSlice';
import { MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { ProductPrice } from '../../../api/types/productPrice';

const ProductPrices: React.FC = () => {
    const dispatch = useAppDispatch();
    const { productPrices, updateStatus, selectedTradePoint } = useAppSelector(state => state.prices);
    const tradePointsList = useAppSelector(state => state.tradePoints.tradePoints);
    const { t } = useTranslation();

    const handleSelectTradePoint = (tradePoint: TradePointData | null) => {
        if (tradePoint) {
            dispatch(setSelectedTradePoint(tradePoint));
            dispatch(fetchProductPricesAsync(tradePoint.id));
        }
    }

    useEffect(() => {
        if (selectedTradePoint) {
            dispatch(fetchProductPricesAsync(selectedTradePoint.id));
        }
    }, [selectedTradePoint]);

    const handleUpdate = () => {
        if (selectedTradePoint) {
            dispatch(updateProductPrices(selectedTradePoint.id));
        }
    }

    useEffect(() => {
        if (!tradePointsList) {
            dispatch(fetchTradePointAsync());
        }
    }, [dispatch]);

    const rows = useMemo(() => productPrices?.map(product => ({
        id: product.productId,
        tradePointId: product.tradePointId,
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        price: product.price,
    })), [productPrices]);

    const columns = useMemo<MRT_ColumnDef<ProductPrice, keyof ProductPrice>[]>(() => [
        {
            accessorKey: 'productId',
            header: `${t('Product')} ${t('ID')}`,
            size: 40,
        },
        {
            accessorKey: 'productName',
            header: t('Product'),
            size: 400,
        },
        {
            accessorKey: 'unit',
            header: t('Unit'),
            size:40,
        },
        {
            accessorKey: 'price',
            header: t('PriceUAH'),
            size: 40,
        },
    ], [t]);

    return (

        <div style={{ height: '90%', width: '100%' }}>
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    {tradePointsList && (
                        <TradePointSelect
                            tradePointsList={tradePointsList}
                            onSelect={handleSelectTradePoint}
                            color='white'
                        />
                    )}
                </div>
                <UpdateButton
                    onClick={handleUpdate}
                    disabled={!selectedTradePoint}
                    updateStatus={updateStatus}
                />
            </div>
            {updateStatus === 'pending' && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color='error' />
                </Box>
            )}
            {rows && !!rows.length && (
                <SimpleTable
                    columns={columns}
                    rows={rows}
                />
            )}
        </div>
    );
}

export default ProductPrices;