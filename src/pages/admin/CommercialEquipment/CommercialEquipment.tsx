import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress } from '@mui/material';
import { ModelData } from '../../../api/types/modelData';
import { MRT_ColumnDef } from 'material-react-table';
import { SimpleTable, UpdateButton } from '../../../components/common';
import { fetchCommercialEquipmentAsync, updateCommercialEquipment } from '../../../redux/slices/commercialEquipmentSlice';


const CommercialEquipment: React.FC = () => {
    const commercialEquipment = useAppSelector(state => state.commercialEquipment.commercialEquipment);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [filterName, setFilterName] = useState<string>('');
    const updateStatus = useAppSelector(state => state.models.updateStatus);

    useEffect(() => {
        dispatch(fetchCommercialEquipmentAsync());
    }, [dispatch]);

    const filteredRows = useMemo(() => {
        return commercialEquipment?.filter((model: ModelData) =>
            model.name.toLowerCase().includes(filterName.toLowerCase())
        );
    }, [commercialEquipment, filterName]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
    };

    const columns = useMemo<MRT_ColumnDef<ModelData, keyof ModelData>[]>(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
        },
        {
            accessorKey: 'name',
            header: t('Name'),
            size: 300,
        },
        {
            accessorKey: 'inventoryNumber',
            header: t('InventoryNumber'),
            size: 40,
        },
        {
            accessorKey: 'factoryNumber',
            header: t('FactoryNumber'),
            size: 40,
        },
        {
            accessorKey: 'tradePointId',
            header: `${t('TradePoint')} ${t('ID')}`,
            size: 40,
        },
        {
            accessorKey: 'modelId',
            header: `${t('Model')} ${t('ID')}`,
            size: 40,
        },
    ], [t]);

    const handleUpdate = () => {
        dispatch(updateCommercialEquipment());
    };

    return (
        <div style={{ height: '90%', width: '100%' }}>
            <div className="flex justify-end mb-4">
                {/*
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder={t('SearchByName')}
                        value={filterName}
                        onChange={handleFilterChange}
                        className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
                    />
                </div>
                */}

                <UpdateButton
                    onClick={handleUpdate}
                    updateStatus={updateStatus}
                />
            </div>
            {updateStatus === 'pending' && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color='error' />
                </Box>
            )}
            {filteredRows && !!filteredRows.length && (
                <SimpleTable
                    columns={columns}
                    rows={filteredRows}
                />
            )}

        </div>
    );
}

export default CommercialEquipment;