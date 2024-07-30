import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { ProductsRemain } from '../../../../api/types/productsRemain';
import { TableTextField } from '../../../../components/common';

export const useProductRemainsColumns = () => {
  const { t } = useTranslation();

  return useMemo<MRT_ColumnDef<ProductsRemain, keyof ProductsRemain>[]>(() => [
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
      accessorKey: 'productName',
      header: t('Name'),
      size: 350,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByName'}
          accessorKey={'productName'}
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
      accessorKey: 'quantity',
      header: t('Quantity'),
      size: 40,
      filterFn: 'betweenInclusive',
    },
  ], [t]);
};