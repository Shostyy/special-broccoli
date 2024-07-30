import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { ModelData } from '../../../../api/types/modelData';
import { TableTextField } from '../../../../components/common';

export const useModelColumns = () => {
  const { t } = useTranslation();

  return useMemo<MRT_ColumnDef<ModelData, keyof ModelData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      filterFn: 'includesString',
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByName'}
          accessorKey={'name'}
        />
      )
    },
  ], [t]);
};