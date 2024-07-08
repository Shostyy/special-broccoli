import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { format, parseISO } from 'date-fns';
import { Tooltip, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { customDateFilter, customTradePointFilter, customStatusFilter, customSumFilter } from '../utils';
import { customTextFieldStyle } from '../styles/customTextFieldStyle';
import { customDatePickerStyles } from '../styles/customDatePickerStyles';
import { OrderData } from '../../../../api/types/orderData';
import { TradePointData } from '../../../../api/types/tradePointData';

export const useColumns = ({
    handleCopyOrder,
    handleChangeOrder,
    handleUpdateStatus,
    handleDeleteOrder,
}: {
    handleCopyOrder: (order: OrderData) => void;
    handleChangeOrder: (order: OrderData) => void;
    handleUpdateStatus: (order: OrderData) => void;
    handleDeleteOrder: (order: OrderData) => void;
}) => {
    const { t } = useTranslation();

    return useMemo<MRT_ColumnDef<OrderData, keyof OrderData>[]>(() => [
        {
            accessorKey: 'docNumber',
            header: t('DocNum'),
            Cell: ({ cell }) => cell.row.original.docNumber || '-',
            minSize: 40,
            size: 40,
            maxSize: 40,
            filterFn: 'includesString',
            grow: false,
            Filter: ({ column }) => (
                <TextField
                    placeholder={`${t('FilterBy')} ${t('DocNum')}`}
                    value={column.getFilterValue() || ''}
                    variant='standard'
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    sx={{ width: '180px', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'tradePoint',
            header: t('TradePoint'),
            Cell: ({ cell }) => {
                const tradePointName = cell.getValue<TradePointData>().name;
                return (
                    <div style={{ width: '200px' }}>
                        {tradePointName.length > 30 ? (
                            <Tooltip title={tradePointName}>
                                <span>{`${tradePointName.substring(0, 30)}...`}</span>
                            </Tooltip>
                        ) : (
                            <>{tradePointName}</>
                        )}
                    </div>
                );
            },
            filterFn: customTradePointFilter,
            Filter: ({ column }) => (
                <TextField
                    placeholder={`${t('FilterBy')} ${t('TradePoint')}`}
                    value={column.getFilterValue() || ''}
                    variant='standard'
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    sx={{ width: '100%', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'dateCreated',
            header: t('CreationDate'),
            size: 40,
            filterFn: customDateFilter,
            Cell: ({ cell }) => format(parseISO(cell.getValue<string>()), 'dd/MM/yy HH:mm'),
            Filter: ({ column }) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '150px' }}>
                    <DatePicker
                        onChange={(newValue) =>
                            column.setFilterValue((old: [Date | null, Date | null]) => [
                                newValue,
                                old?.[1],
                            ])
                        }
                        label={t('StartDate')}
                        sx={{
                            ...customDatePickerStyles,
                        }}
                    />
                    <DatePicker
                        onChange={(newValue) =>
                            column.setFilterValue((old: [Date | null, Date | null]) => [
                                old?.[0],
                                newValue,
                            ])
                        }
                        label={t('EndDate')}
                        sx={{ ...customDatePickerStyles }}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'sum',
            header: t('Sum'),
            minSize: 20,
            size: 40,
            Cell: ({ cell }) => cell.row.original.sum.toFixed(2),
            filterFn: customSumFilter,
            Filter: ({ column }) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '150px' }}>
                    <TextField
                        placeholder={t('Min')}
                        type="text"
                        variant='standard'
                        onChange={(e) =>
                            column.setFilterValue((old: [number | undefined, number | undefined]) => [
                                e.target.value ? Number(e.target.value) : undefined,
                                old?.[1],
                            ])
                        }
                        sx={{
                            width: '100px',
                            ...customTextFieldStyle
                        }}
                    />
                    <TextField
                        placeholder={t('Max')}
                        type="text"
                        onChange={(e) =>
                            column.setFilterValue((old: [number | undefined, number | undefined]) => [
                                old?.[0],
                                e.target.value ? Number(e.target.value) : undefined,
                            ])
                        }
                        variant='standard'
                        sx={{
                            width: '100px',
                            ...customTextFieldStyle

                        }}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: t('Status'),
            size: 40,
            maxSize: 40,
            Cell: ({ cell }) => t(cell.row.original.status),
            filterFn: customStatusFilter,
            Filter: ({ column }) => (
                <TextField
                    select
                    value={column.getFilterValue() || ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    variant='standard'
                    sx={{ width: '100px', ...customTextFieldStyle }}
                >
                    <MenuItem value="" key="select-all">
                        {t('SelectAll')}
                    </MenuItem>
                    {['DRAFT', 'DELIVERY', 'ACCEPTED', 'DONE'].map((status) => (
                        <MenuItem key={status} value={status}>
                            {t(status)}
                        </MenuItem>
                    ))}
                </TextField>
            ),
        },
        {
            accessorKey: 'comment',
            header: t('Comment'),
            size: 60,
            Cell: ({ cell }) => {
                const comment = cell.row.original.comment || '-';
                return (
                    <div style={{ height: '2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {comment.length > 40 ? (
                            <Tooltip title={comment}>
                                <span>{`${comment.substring(0, 40)}...`}</span>
                            </Tooltip>
                        ) : (
                            <span>{comment}</span>
                        )}
                    </div>
                );
            },
            filterFn: 'includesString',
            Filter: ({ column }) => (
                <TextField
                    placeholder={`${t('FilterBy')} ${t('Comment')}`}
                    value={column.getFilterValue() || ''}
                    variant='standard'
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    sx={{ width: '200px', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'actions',
            header: t('Actions'),
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({ row }: { row: { original: OrderData } }) => {
                const [openOptions, setOpenOptions] = React.useState(false);

                const handleOpenOptions = () => {
                    setOpenOptions(!openOptions);
                };

                const stopPropagation = (event: React.MouseEvent) => {
                    event.stopPropagation();
                };

                return (
                    <div className="flex space-x-2">
                        {openOptions ? (
                            <>
                                <button
                                    onClick={(event) => {
                                        stopPropagation(event);
                                        handleCopyOrder(row.original);
                                        setOpenOptions(false);
                                    }}
                                    className="text-gray-500 p-1 rounded"
                                    title={t('CopyOrder')}
                                >
                                    <ContentCopyIcon />
                                </button>
                                <button
                                    onClick={(event) => {
                                        stopPropagation(event);
                                        handleChangeOrder(row.original);
                                        setOpenOptions(false);
                                    }}
                                    className="text-gray-500 p-1 rounded"
                                    title={t('ChangeOrder')}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    onClick={(event) => {
                                        stopPropagation(event);
                                        handleUpdateStatus(row.original);
                                        setOpenOptions(false);
                                    }}
                                    className="text-gray-500 p-1 rounded"
                                    title={t('UpdateStatus')}
                                >
                                    <UpdateIcon />
                                </button>
                                <button
                                    onClick={(event) => {
                                        stopPropagation(event);
                                        handleDeleteOrder(row.original);
                                        setOpenOptions(false);
                                    }}
                                    className="text-gray-500 p-1 rounded"
                                    title={t('DeleteOrder')}
                                >
                                    <DeleteIcon />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={(event) => {
                                    stopPropagation(event);
                                    handleOpenOptions();
                                }}
                                className="text-gray-500 p-1 rounded"
                                title={t('Options')}
                            >
                                <MoreHorizIcon />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ], [handleCopyOrder, handleChangeOrder, handleUpdateStatus, handleDeleteOrder, t]);
};
