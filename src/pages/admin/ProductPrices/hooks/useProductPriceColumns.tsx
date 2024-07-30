import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { ProductPrice } from '../../../../api/types/productPrice';
import { TableTextField } from '../../../../components/common';

export const useProductPriceColumns = () => {
  const { t } = useTranslation();

  return useMemo<MRT_ColumnDef<ProductPrice, keyof ProductPrice>[]>(() => [
    {
      accessorKey: 'productId',
      header: `${t('Product')} ${t('ID')}`,
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByID'}
          accessorKey={'productId'}
        />
      )
    },
    {
      accessorKey: 'productName',
      header: t('Product'),
      size: 400,
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
      accessorKey: 'price',
      header: t('PriceUAH'),
      size: 40,
      filterFn: 'betweenInclusive',
    },
  ], [t]);
};