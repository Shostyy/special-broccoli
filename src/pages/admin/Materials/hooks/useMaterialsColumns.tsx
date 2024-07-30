import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { MaterialData } from '../../../../api/types/materialData';
import { TableTextField } from '../../../../components/common';
import { MenuItem, TextField } from '@mui/material';

export const useMaterialColumns = () => {
    const { t } = useTranslation();

    return useMemo<MRT_ColumnDef<MaterialData, keyof MaterialData>[]>(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'name',
            header: t('Name'),
            size: 350,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByName'}
                    accessorKey={'name'}
                />
            )
        },
        {
            accessorKey: 'unit',
            header: t('Unit'),
            size: 40,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByUnit'}
                    accessorKey={'unit'}
                />
            )
        },
        {
            accessorKey: 'weighty',
            header: t('Weighty'),
            Cell: ({ cell }) => (
                cell.row.original.weighty ? t('Yes') : t('No')
            ),
            size: 40,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TextField
                    select
                    value={String(column.getFilterValue() ?? '')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => column.setFilterValue(e.target.value)}
                    variant='standard'
                    sx={{ width: '100px' }}
                >
                    <MenuItem value="" key="select-all">
                        {t('SelectAll')}
                    </MenuItem>
                    <MenuItem value="true" key="select-yes">
                        {t('Yes')}
                    </MenuItem>
                    <MenuItem value="false" key="select-no">
                        {t('No')}
                    </MenuItem>
                </TextField>
            ),
        },
    ], [t]);
};
