import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { CustomerData } from '../../../../api/types/customerData';
import { TableTextField } from '../../../../components/common';
import TruncatedText from '../../../../components/common/TruncatedText/TruncatedText';

export const useCustomerColumns = () => {
  const { t } = useTranslation();

  return useMemo<MRT_ColumnDef<CustomerData, keyof CustomerData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      filterFn: 'includesString',
      size: 40,
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByID'}
          accessorKey={'ID'}
          width={140}
        />
      )
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      filterFn: 'includesString',
      Cell: ({ cell }) => <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}><span>{cell.row.original.name}</span></div>,
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByName'}
          accessorKey={'name'}
        />
      )
    },
    {
      accessorKey: 'phones',
      header: t('Phones'),
      filterFn: 'includesString',
      size: 40,
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByPhone'}
          accessorKey={'phones'}
        />
      )
    },
    {
      accessorKey: 'emails',
      header: t('Email'),
      filterFn: 'includesString',
      size: 160,
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByEmail'}
          accessorKey={'emails'}
        />
      )
    },
    {
      accessorKey: 'addresses',
      header: t('Addresses'),
      size: 350,
      filterFn: 'includesString',
      Cell: ({ cell }) => (
        <TruncatedText
          text={cell.row.original.addresses}
          maxLength={75}
        />
      ),
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByAddress'}
          accessorKey={'addresses'}
        />
      )
    },
  ], [t]);
};