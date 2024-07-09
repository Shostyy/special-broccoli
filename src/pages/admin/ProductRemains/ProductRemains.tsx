import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchBranchOfficesAsync } from '../../../redux/slices/branchOfficesSlice';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@mui/material/LinearProgress';
import { Stack } from '@mui/material';
import { clearRemains, fetchProductRemainsAsync, updateProductRemains } from '../../../redux/slices/productsRemains';
import { MRT_ColumnDef } from 'material-react-table';
import { ProductsRemain } from '../../../api/types/productsRemain';
import { BranchOfficesSelect, SimpleTable, UpdateButton } from '../../../components/common';
import { BranchOffice } from '../../../api/types/branchOffice';

const ProductRemains: React.FC = () => {
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const { productRemains, updateStatus } = useAppSelector(state => state.productRemain);
    const branchOffices = useAppSelector(state => state.branchOffices.branchOffices);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        dispatch(fetchBranchOfficesAsync());
    }, [dispatch]);

    const handleBranchOfficeChange = async (branchOffice: BranchOffice | null) => {
        if (branchOffice) {
            setSelectedBranchOffice(branchOffice.id);
            setIsLoading(true);
            await dispatch(fetchProductRemainsAsync(branchOffice.id));
            setIsLoading(false);
        } else {
            setSelectedBranchOffice(null);
            dispatch(dispatch(clearRemains()));
        }

    };

    console.log(productRemains);

    const rowsWithId = productRemains?.map(product => ({
        ...product,
        id: product.productId,
    }));

    const columns = useMemo<MRT_ColumnDef<ProductsRemain, keyof ProductsRemain>[]>(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
        },
        {
            accessorKey: 'productName',
            header: t('Name'),
            size: 350,
        },
        {
            accessorKey: 'unit',
            header: t('Unit'),
            size: 40,
        },
        {
            accessorKey: 'quantity',
            header: t('Quantity'),
            size: 40,
        },
    ], [t]);


    const handleUpdate = () => {
        if (selectedBranchOffice) {
            dispatch(updateProductRemains(selectedBranchOffice))
        }
    }

    return (
        <div style={{ height: '90%', width: '100%' }} id="table-container">
            <div className="flex justify-between mb-4">
                {branchOffices && (
                    <BranchOfficesSelect
                        branchOfficeList={branchOffices}
                        onSelect={handleBranchOfficeChange}
                        color='white'
                        width={300}
                    />
                )}
                <UpdateButton
                    onClick={handleUpdate}
                    disabled={!selectedBranchOffice}
                    updateStatus={updateStatus}
                />
            </div>
            <Stack sx={{ width: '100%', color: 'grey.500', height: '4px' }} spacing={2}>
                {isLoading && (
                    <LinearProgress color="error" />
                )}
            </Stack>
            {rowsWithId && rowsWithId.length && (
                <SimpleTable
                    columns={columns}
                    rows={rowsWithId}
                    customRowHeight={54}
                />
            )}
        </div>
    );
};

export default ProductRemains;
