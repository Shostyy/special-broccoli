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
import { customTextFieldStyle } from '../styles/customTextFieldStyle';
import { customDatePickerStyles } from '../styles/customDatePickerStyles';
import { OrderData } from '../../../../api/types/orderData';
import { TradePointData } from '../../../../api/types/tradePointData';
import { ADMIN_ROLE, ORDERS_MAX_COMMENT_LENGTH, SPLIT_START, STATUS_STEPS } from '../../../../data/constants/constants';
import { UserInfo } from '../../../../api/types/userInfo';

export const useColumns = ({
    handleCopyOrder,
    handleChangeOrder,
    handleUpdateStatus,
    handleDeleteOrder,
    filters,
    handleFilterChange,
    userInfo,
}: {
    handleCopyOrder: (order: OrderData) => void;
    handleChangeOrder: (order: OrderData) => void;
    handleUpdateStatus: (order: OrderData) => void;
    handleDeleteOrder: (order: OrderData) => void;
    filters: any;
    handleFilterChange: (key: string, value: any) => void;
    userInfo?: UserInfo | null;
}) => {
    const { t } = useTranslation();
    const role = userInfo?.role.name;

    return useMemo<MRT_ColumnDef<OrderData, keyof OrderData>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            Filter: () => (
                <TextField
                    placeholder={t('FilterByID')}
                    value={filters.id}
                    variant='standard'
                    onChange={(e) => handleFilterChange('id', e.target.value)}
                    sx={{ width: '130px', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'docNumber',
            header: t('DocNum'),
            Cell: ({ cell }) => cell.row.original.docNumber || '-',
            minSize: 20,
            size: 40,
            maxSize: 40,
            grow: false,
            Filter: () => (
                <TextField
                    placeholder={t('FilterByDocNumber')}
                    value={filters.docNumber}
                    variant='standard'
                    onChange={(e) => handleFilterChange('docNumber', e.target.value)}
                    sx={{ width: '240px', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'tradePoint',
            header: t('TradePoint'),
            Cell: ({ cell }) => {
                const tradePointName = cell.getValue<TradePointData>().name;
                return (
                    <Tooltip title={`${t('ShowOrdersByTradePoint')} ${tradePointName}`}>
                        <div style={{ width: '200px' }} onClick={(event) => {
                            event.stopPropagation();
                            handleFilterChange('tradePoint', tradePointName);
                        }}>
                            {tradePointName.length > 30 ? (
                                <Tooltip title={tradePointName}>
                                    <span>{`${tradePointName.substring(0, 30)}...`}</span>
                                </Tooltip>
                            ) : (
                                <>{tradePointName}</>
                            )}
                        </div>
                    </Tooltip>
                );
            },
            Filter: () => (
                <TextField
                    placeholder={t('FilterByTradePoint')}
                    value={filters.tradePoint}
                    variant='standard'
                    onChange={(e) => handleFilterChange('tradePoint', e.target.value)}
                    sx={{ width: '100%', ...customTextFieldStyle }}
                />
            ),
        },
        {
            accessorKey: 'dateCreated',
            header: t('CreationDate'),
            size: 40,
            Cell: ({ cell }) => format(parseISO(cell.getValue<string>()), 'dd/MM/yy HH:mm'),
            Filter: () => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', width: '220px' }}>
                    <DatePicker
                        value={filters.dateCreatedStart}
                        onChange={(newValue) => handleFilterChange('dateCreatedStart', newValue)}
                        label={t('StartDate')}
                        views={['year', 'month', 'day']}
                        sx={{
                            width: '110px',
                            ...customDatePickerStyles,
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                        }}
                    />
                    <DatePicker
                        value={filters.dateCreatedEnd}
                        onChange={(newValue) => handleFilterChange('dateCreatedEnd', newValue)}
                        label={t('EndDate')}
                        views={['year', 'month', 'day']}
                        sx={{
                            width: '110px',
                            ...customDatePickerStyles,
                        }}
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
            Filter: () => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', width: '150px' }}>
                    <TextField
                        placeholder={t('Min')}
                        type="number"
                        variant='standard'
                        value={filters.sumMin}
                        onChange={(e) => handleFilterChange('sumMin', e.target.value)}
                        sx={{
                            width: '100px',
                            ...customTextFieldStyle,
                        }}
                    />
                    <TextField
                        placeholder={t('Max')}
                        type="number"
                        value={filters.sumMax}
                        onChange={(e) => handleFilterChange('sumMax', e.target.value)}
                        variant='standard'
                        sx={{
                            width: '100px',
                            ...customTextFieldStyle,
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
            Filter: () => (
                <TextField
                    select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    variant='standard'
                    sx={{ width: '100px', ...customTextFieldStyle }}
                >
                    <MenuItem value="" key="select-all">
                        {t('SelectAll')}
                    </MenuItem>
                    {STATUS_STEPS.map((status) => (
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
                    <div style={{ height: '2rem', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {comment.length > ORDERS_MAX_COMMENT_LENGTH ? (
                            <Tooltip title={comment}>
                                <span>{`${comment.substring(SPLIT_START, ORDERS_MAX_COMMENT_LENGTH)}...`}</span>
                            </Tooltip>
                        ) : (
                            <span>{comment}</span>
                        )}
                    </div>
                );
            },
            Filter: () => (
                <TextField
                    placeholder={t('FilterByComment')}
                    value={filters.comment}
                    variant='standard'
                    onChange={(e) => handleFilterChange('comment', e.target.value)}
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

                const status = row.original.status;


                return (
                    <div className="flex space-x-2">
                        {role === ADMIN_ROLE ? (
                            status === 'DRAFT' ? (
                                <button className="text-gray-500 p-1 rounded" title={t('NoAction')}>
                                    -
                                </button>
                            ) : (
                                <button
                                    onClick={(event) => {
                                        stopPropagation(event);
                                        handleUpdateStatus(row.original);
                                    }}
                                    className="text-gray-500 p-1 rounded"
                                    title={t('UpdateOrderStatus')}
                                >
                                    <UpdateIcon />
                                </button>
                            )
                        ) : (
                            <>
                                {openOptions ? (
                                    <>
                                        {status === 'DRAFT' && (
                                            <>
                                                <button
                                                    onClick={(event) => {
                                                        stopPropagation(event);
                                                        handleChangeOrder(row.original);
                                                        setOpenOptions(false);
                                                    }}
                                                    className="text-gray-500 p-1 rounded"
                                                    title={t('EditOrder')}
                                                >
                                                    <EditIcon />
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
                                            </>
                                        )}
                                        {(status === 'ACCEPTED' || status === 'DELIVERY' || status === 'CANCELLED' || status === 'DONE') && (
                                            <>
                                                <button
                                                    onClick={(event) => {
                                                        stopPropagation(event);
                                                        handleUpdateStatus(row.original);
                                                        setOpenOptions(false);
                                                    }}
                                                    className="text-gray-500 p-1 rounded"
                                                    title={t('UpdateOrderStatus')}
                                                >
                                                    <UpdateIcon />
                                                </button>
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
                                            </>
                                        )}
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
                            </>
                        )}
                    </div>
                );
            }
        }
    ], [t, filters, handleFilterChange, handleCopyOrder, handleChangeOrder, handleUpdateStatus, handleDeleteOrder]);
};