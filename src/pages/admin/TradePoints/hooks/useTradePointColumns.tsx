import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { TradePointData } from '../../../../api/types/tradePointData';
import { TableTextField, TruncatedText } from '../../../../components/common';

export const useTradePointColumns = () => {
    const { t } = useTranslation();

    return useMemo<MRT_ColumnDef<TradePointData, keyof TradePointData>[]>(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
            minSize: 20,
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
            filterFn: 'includesString',
            size: 200,
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByName'}
                    accessorKey={'name'}
                />
            ),
            Cell: ({ cell }) => (
                <TruncatedText
                    text={cell.getValue<string>()}
                    maxLength={30}
                    tooltipDisableThreshold={30}
                />
            ),
        },
        {
            accessorKey: 'address',
            header: t('Address'),
            filterFn: 'includesString',
            size: 250,
            Cell: ({ cell }) => (
                <TruncatedText
                    text={cell.getValue<string>()}
                    maxLength={90}
                    tooltipDisableThreshold={90}
                />
            ),
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByAddress'}
                    accessorKey={'address'}
                />
            )
        },
        {
            accessorKey: 'branchOfficeName',
            header: t('BranchOffice'),
            filterFn: 'includesString',
            size: 40,
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByOffice'}
                    accessorKey={'branchOfficeName'}
                />
            ),
            Cell: ({ cell }) => (
                <TruncatedText
                    text={cell.getValue<string>()}
                    maxLength={20}
                    tooltipDisableThreshold={20}
                />
            ),
        },
        {
            accessorKey: 'customerName',
            header: t('Customer'),
            filterFn: 'includesString',
            size: 40,
            Filter: ({ column }) => (
                <TableTextField
                    handleFilterChange={(_, newValue) => column.setFilterValue(newValue)}
                    placeholderTranslationKey={'FilterByCustomer'}
                    accessorKey={'customerName'}
                />
            ),
            Cell: ({ cell }) => (
                <TruncatedText
                    text={cell.getValue<string>()}
                    maxLength={20}
                    tooltipDisableThreshold={20}
                />
            ),
        },
    ], [t]);
};