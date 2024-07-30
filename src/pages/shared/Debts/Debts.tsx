import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchAllDebtsAsync, updateDebts } from '../../../redux/slices/debtsSlice';
import { fetchTradePointAsync } from '../../../redux/slices/tradePointsSlice';
import { fetchCustomersAsync } from '../../../redux/slices/customersSlice';
import { GeneralButton, SimpleTable, UpdateButton } from '../../../components/common';
import { Alert, Box, LinearProgress, Stack, TextField, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { DebtData } from '../../../api/types/debtData';
import ordersApi from '../../../api/methods/ordersApi';
import { appIcons } from '../../../data/constants/icons';
import { fetchClientFullResponse } from '../../../api/fetchClientFullResponse';
import { CustomerInfo } from '../../../api/types/customerInfo';
import { BASE_URL } from '../../../data/constants/constants';
import { customTextFieldStyle } from '../Orders/styles/customTextFieldStyle';

const Debts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { debts, updateStatus } = useAppSelector(state => state.debts);
    const user = useAppSelector(state => state.login.userInfo);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filteredDebts, setFilteredDebts] = useState<DebtData[]>([]);
    const [filters, setFilters] = useState({
        customerName: '',
        tradePointName: '',
        docNumber: '',
        sumMin: '',
        sumMax: ''
    });
    const [customerNames, setCustomerNames] = useState<string[]>([]);
    const [tradePointNames, setTradePointNames] = useState<string[]>([]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchClientFullResponse.get<CustomerInfo[]>(`${BASE_URL}/api/users/user-customers`)
            .then((res) => {
                const onlyCurrentUserCustomer = res.data.filter(customer => customer.userId === user?.id);

                if (onlyCurrentUserCustomer.length > 0) {
                    ordersApi.getTradePointForOrders()
                        .then(res => {
                            if (res.length === 0) {
                                if (user?.role.name === 'ADMIN') {
                                    dispatch(fetchTradePointAsync());
                                } else {
                                    setErrorMessage(t('NoRelationshipError'));
                                }
                            }
                        })
                        .catch(err => console.log(err));
                } else {
                    dispatch(fetchCustomersAsync());
                    if (user?.role.name === 'ADMIN') {
                        dispatch(fetchTradePointAsync());
                    }
                }
            })
            .catch(err => console.log(err));

        dispatch(fetchAllDebtsAsync({}));
    }, [dispatch, t, user]);

    useEffect(() => {
        if (debts) {
            const uniqueCustomerNames = Array.from(new Set(debts.map(debt => debt.customerName)));
            const uniqueTradePointNames = Array.from(new Set(debts.map(debt => debt.tradePointName)));
            setCustomerNames(uniqueCustomerNames);
            setTradePointNames(uniqueTradePointNames);

            let filtered = debts;
            if (filters.customerName) {
                filtered = filtered.filter(debt => debt.customerName?.toLowerCase().includes(filters.customerName.toLowerCase()));
            }
            if (filters.tradePointName) {
                filtered = filtered.filter(debt => debt.tradePointName?.toLowerCase().includes(filters.tradePointName.toLowerCase()));
            }
            if (filters.docNumber) {
                filtered = filtered.filter(debt => debt.docNumber?.toLowerCase().includes(filters.docNumber.toLowerCase()));
            }
            if (filters.sumMin) {
                filtered = filtered.filter(debt => debt.sum >= Number(filters.sumMin));
            }
            if (filters.sumMax) {
                filtered = filtered.filter(debt => debt.sum <= Number(filters.sumMax));
            }
            setFilteredDebts(filtered);
        }
    }, [debts, filters]);

    const handleUpdate = () => {
        dispatch(updateDebts());
    };

    const totalDebt = useMemo(() => {
        return filteredDebts.reduce((acc, debt) => acc + debt.sum, 0).toFixed(2);
    }, [filteredDebts]);

    const handleResetFilters = () => {
        setFilters({
            customerName: '',
            tradePointName: '',
            docNumber: '',
            sumMin: '',
            sumMax: ''
        });
        if (debts) {
            setFilteredDebts(debts);
        }
    };

    const columns = useMemo<MRT_ColumnDef<DebtData, keyof DebtData>[]>(() => [
        {
            accessorKey: 'customerName',
            header: t('CustomerName'),
            minSize: 200,
            maxSize: 200,
            size: 200,
            Filter: () => (
                <TextField
                    placeholder={t('FilterByCustomer')}
                    value={filters.customerName}
                    variant='standard'
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                    sx={{ width: '240px', ...customTextFieldStyle }}
                />
            ),
            Cell: ({ row }) => (
                <Tooltip title={`${t('ShowDebtsByCustomer')} ${row.original.customerName}`}>
                    <div style={{ width: '200px', cursor: 'pointer' }} onClick={() => handleFilterChange('customerName', row.original.customerName)}>
                        <>{row.original.customerName}</>
                    </div>
                </Tooltip>
            ),
            Footer: () => <div style={{ fontSize: '15px' }}>{t('DebtRes')}</div>,
        },
        {
            accessorKey: 'tradePointName',
            header: t('TradePoint'),
            minSize: 400,
            maxSize: 400,
            size: 400,
            Filter: () => (
                <TextField
                    placeholder={t('FilterByTradePoint')}
                    value={filters.tradePointName}
                    variant='standard'
                    onChange={(e) => handleFilterChange('tradePointName', e.target.value)}
                    sx={{ width: '240px', ...customTextFieldStyle }}
                />
            ),
            Cell: ({ row }) => (
                <Tooltip title={`${t('ShowDebtsByTradePoint')} ${row.original.customerName}`}>
                    <div style={{ width: '200px', cursor: 'pointer' }} onClick={() => handleFilterChange('tradePointName', row.original.tradePointName)}>
                        <>{row.original.tradePointName}</>
                    </div>
                </Tooltip>
            ),
        },
        {
            accessorKey: 'docNumber',
            header: t('DocNumber'),
            minSize: 200,
            maxSize: 200,
            size: 200,
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
            accessorKey: 'sum',
            header: t('Sum'),
            minSize: 200,
            maxSize: 200,
            size: 200,
            Filter: () => (
                <Box display="flex" gap={1}>
                    <TextField
                        placeholder={t('Min')}
                        value={filters.sumMin}
                        variant='standard'
                        type="number"
                        onChange={(e) => handleFilterChange('sumMin', e.target.value)}
                        sx={{ width: '120px', ...customTextFieldStyle }}
                    />
                    <TextField
                        placeholder={t('Max')}
                        value={filters.sumMax}
                        variant='standard'
                        type="number"
                        onChange={(e) => handleFilterChange('sumMax', e.target.value)}
                        sx={{ width: '120px', ...customTextFieldStyle }}
                    />
                </Box>
            ),
            Cell: ({ row }) => row.original.sum !== 0 ? row.original.sum.toFixed(2) : '',
            Footer: () => <div style={{ fontSize: '15px' }}>{totalDebt}</div>,
        },
    ], [t, totalDebt, filters, handleFilterChange]);

    const emptyResult: DebtData[] = [{
        customerName: t('SearchNotFound'),
        tradePointName: '',
        docNumber: '',
        sum: 0,
    }];

    if (errorMessage) {
        return (
            <Stack>
                <Alert variant="outlined" severity="error" sx={{ bgcolor: 'white' }}>
                    <span className="text-red-500">{errorMessage}</span>
                </Alert>
            </Stack>
        );
    } else {
        return (
            <div style={{ height: '90%', width: '100%' }}>
                <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-10"></div>
                    <div className='flex gap-4'>
                        <GeneralButton
                            onClick={handleResetFilters}
                            icon={appIcons.closeRed}
                            translationKey={'ResetFilters'}
                        />
                        <UpdateButton
                            onClick={handleUpdate}
                            updateStatus={updateStatus}
                        />
                    </div>
                </div>
                {updateStatus === 'pending' && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color='error' />
                    </Box>
                )}
                <SimpleTable
                    columns={columns}
                    rows={filteredDebts.length > 0 ? filteredDebts : emptyResult}
                    enableFiltering={true}
                    enableFooter={true}
                    customRowHeight={37}
                    customHeaderHeight={176}
                    density='compact'
                />
            </div>
        );
    }
};

export default Debts;