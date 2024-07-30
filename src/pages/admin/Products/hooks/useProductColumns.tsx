import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { ProductData } from '../../../../api/types/productData';
import { TableTextField } from '../../../../components/common';

export const useProductColumns = () => {
    const { t } = useTranslation();

    return useMemo<MRT_ColumnDef<ProductData, keyof ProductData>[]>(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByID'}
                    accessorKey={'id'}
                />
            )
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
            accessorKey: 'sku',
            header: t('SKU'),
            size: 40,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterBySKU'}
                    accessorKey={'sku'}
                />
            )
        },
        {
            accessorKey: 'categoryName',
            header: t('Category'),
            size: 40,
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByCategory'}
                    accessorKey={'categoryName'}
                />
            )
        },
    ], [t]);
};