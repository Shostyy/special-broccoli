import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { CategoryData } from '../../../../api/types/categoryData';
import { TableTextField } from '../../../../components/common';

export const useCategoryColumns = (): MRT_ColumnDef<CategoryData, keyof CategoryData>[] => {
  const { t } = useTranslation();

  return useMemo(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey="FilterByID"
          accessorKey="id"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey="FilterByName"
          accessorKey="id"
        />
      ),
    },
  ], [t]);
};