import React, { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { SimpleTable, TableTextField } from '../../../../components/common';
import { CommercialEquipmentControl } from '../../../../api/types/commercialEquipmentControl';
import { format, parseISO } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { customDatePickerStyles } from '../../../shared/Orders/styles/customDatePickerStyles';

interface ControlHistoryTableProps {
    controlHistory: CommercialEquipmentControl[];
    onRowClick: (row: CommercialEquipmentControl) => void;
}

const ControlHistoryTable: React.FC<ControlHistoryTableProps> = ({ controlHistory, onRowClick }) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        id: '',
        dateCreatedStart: null,
        dateCreatedEnd: null,
        tradePointId: '',
        tradePointName: '',
    });

    const [filteredControlHistory, setFilteredControlHistory] = useState<CommercialEquipmentControl[]>(controlHistory);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        let filtered = controlHistory;

        if (filters.id) {
            filtered = filtered.filter(control => control.id.toString().includes(filters.id));
        }

        if (filters.tradePointId) {
            filtered = filtered.filter(control => control.tradePointId.toString().includes(filters.tradePointId));
        }

        if (filters.tradePointName) {
            filtered = filtered.filter(control => control.tradePointName.toLowerCase().includes(filters.tradePointName.toLowerCase()));
        }

        if (filters.dateCreatedStart) {
            filtered = filtered.filter(control => dayjs(control.date).isAfter(filters.dateCreatedStart));
        }
        if (filters.dateCreatedEnd) {
            filtered = filtered.filter(control => dayjs(control.date).isBefore(filters.dateCreatedEnd));
        }

        setFilteredControlHistory(filtered);
    }, [controlHistory, filters]);

    const columns = useMemo<MRT_ColumnDef<CommercialEquipmentControl, keyof CommercialEquipmentControl>[]>(() => [
        {
            accessorKey: 'date',
            header: t('CreationDate'),
            filterFn: 'includesString',
            size: 200,
            Cell: ({ cell }) => format(parseISO(cell.getValue<string>()), 'dd/MM/yy HH:mm'),
            Filter: () => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', width: '280px' }}>
                    <DatePicker
                        value={filters.dateCreatedStart}
                        onChange={(newValue) => handleFilterChange('dateCreatedStart', newValue)}
                        label={t('StartDate')}
                        views={['year', 'month', 'day']}
                        sx={{
                            ...customDatePickerStyles,
                            width: '120px',
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                        }}
                    />
                    <DatePicker
                        value={filters.dateCreatedEnd}
                        onChange={(newValue) => handleFilterChange('dateCreatedEnd', newValue)}
                        label={t('EndDate')}
                        views={['year', 'month', 'day']}
                        sx={{
                            ...customDatePickerStyles,
                            width: '120px',
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                        }}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'id',
            header: t('ID'),
            filterFn: 'includesString',
            minSize: 200,
            size: 400,
            maxSize: 490,
            Cell: ({ cell }) => <div>{cell.getValue()}</div>,
            Filter: () => (
                <TableTextField
                    handleFilterChange={(_, newValue) => handleFilterChange('id', newValue)}
                    placeholderTranslationKey={'FilterByID'}
                    accessorKey='includesString'
                    width={140}
                />
            ),
        },
        {
            accessorKey: 'tradePointName',
            header: t('TradePoint'),
            filterFn: 'includesString',
            Cell: ({ cell }) => <div>{cell.getValue()}</div>,
            minSize: 200,
            size: 400,
            maxSize: 490,
            Filter: () => (
                <TableTextField
                    handleFilterChange={(_, newValue) => handleFilterChange('tradePointName', newValue)}
                    placeholderTranslationKey={'FilterByTradePoint'}
                    accessorKey='tradePointName'
                />
            ),
        },
    ], [t, filters]);

    return (
        <SimpleTable
            columns={columns}
            rows={filteredControlHistory}
            onRowClick={onRowClick}
        />
    );
};

export default ControlHistoryTable;
