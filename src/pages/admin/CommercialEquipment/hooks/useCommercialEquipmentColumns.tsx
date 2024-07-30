import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { TableTextField } from '../../../../components/common';
import { CommercialEquipment } from '../../../../api/types/commercialEquipment';

export const useCommercialEquipmentColumns = () => {
  const { t } = useTranslation();

  return useMemo<MRT_ColumnDef<CommercialEquipment, keyof CommercialEquipment>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
      filterFn: 'includesString',
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 300,
      Cell: ({ cell }) => (
        <div className="flex items-center h-8">
          {cell.row.original.name}
        </div>
      ),
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
      accessorKey: 'inventoryNumber',
      header: t('InventoryNumber'),
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByInventoryNumber'}
          accessorKey={'inventoryNumber'}
        />
      )
    },
    {
      accessorKey: 'factoryNumber',
      header: t('FactoryNumber'),
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByFactoryNumber'}
          accessorKey={'factoryNumber'}
        />
      )
    },
    {
      accessorKey: 'tradePointId',
      header: `${t('TradePoint')} ${t('ID')}`,
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByTradePointId'}
          accessorKey={'unit'}
        />
      )
    },
    {
      accessorKey: 'modelId',
      header: `${t('Model')} ${t('ID')}`,
      size: 40,
      filterFn: 'includesString',
      Filter: ({ column }) => (
        <TableTextField
          handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
          placeholderTranslationKey={'FilterByModelId'}
          accessorKey={'modelId'}
        />
      )
    },
  ], [t]);
};