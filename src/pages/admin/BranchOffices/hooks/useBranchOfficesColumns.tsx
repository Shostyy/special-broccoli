import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { BranchOffice } from '../../../../api/types/branchOffice';
import { TableTextField } from '../../../../components/common';

export const useBranchOfficesColumns = (): MRT_ColumnDef<BranchOffice, keyof BranchOffice>[] => {
  const { t } = useTranslation();

  return useMemo(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey="FilterByID"
          accessorKey="ID"
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
          accessorKey="name"
        />
      ),
    },
  ], [t]);
};