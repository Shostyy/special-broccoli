import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchAllDebtsAsync, updateDebts } from '../../../redux/slices/debtsSlice';
import { fetchTradePointAsync } from '../../../redux/slices/tradePointsSlice';
import { fetchCustomersAsync } from '../../../redux/slices/customersSlice';
import { GeneralButton, SimpleTable, TradePointSelect, UpdateButton } from '../../../components/common';
import { TradePointData } from '../../../api/types/tradePointData';
import { Alert, Box, LinearProgress, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomerData } from '../../../api/types/customerData';
import CustomerSelect from '../../../components/common/Selects/CustomerSelect';
import { MRT_ColumnDef } from 'material-react-table';
import { DebtData } from '../../../api/types/debtData';
import ordersApi from '../../../api/methods/ordersApi';
import { appIcons } from '../../../data/constants/icons';
import { fetchClientFullResponse } from '../../../api/fetchClientFullResponse';
import { CustomerInfo } from '../../../api/types/customerInfo';
import { BASE_URL } from '../../../data/constants/constants';
import CustomerInfoSelect from '../../../components/common/Selects/CustomerInfoSelect';

const Debts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const tradePoints = useAppSelector(state => state.tradePoints.tradePoints);
    const customers = useAppSelector(state => state.customers.customers);
    const [selectedTradePoint, setSelectedTradePoint] = useState<TradePointData | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | CustomerInfo | null>(null);
    const { debts, updateStatus } = useAppSelector(state => state.debts);
    const [tradePointsForDebts, setTradePointsForDebts] = useState<TradePointData[] | null>(null);
    const [customersForDebts, setCustomersForDebts] = useState<CustomerInfo[] | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const user = useAppSelector(state => state.login.userInfo);

    useEffect(() => {
        fetchClientFullResponse.get<CustomerInfo[]>(`${BASE_URL}/api/users/user-customers`)
            .then((res) => {
                const onlyCurrentUserCustomer = res.data.filter(customer => customer.userId === user?.id);

                if (onlyCurrentUserCustomer.length > 0) {
                    setCustomersForDebts(onlyCurrentUserCustomer);

                    ordersApi.getTradePointForOrders()
                        .then(res => {
                            if (res.length === 0) {
                                if (user?.role.name === 'ADMIN') {
                                    dispatch(fetchTradePointAsync());
                                } else {
                                    setErrorMessage(t('NoRelationshipError'));
                                }
                            } else {
                                setTradePointsForDebts(res);
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

    const handleSelectTradePoint = (tradePoint: TradePointData | null) => {
        if (tradePoint) {
            setSelectedTradePoint(tradePoint);
            setSelectedCustomer(null);
            dispatch(fetchAllDebtsAsync({ tradePointId: tradePoint.id }));
        } else {
            setSelectedTradePoint(null);
            dispatch(fetchAllDebtsAsync({}));
        }
    };

    const handleSelectCustomer = (customer: CustomerData | CustomerInfo | null) => {
        if (customer) {
            setSelectedCustomer(customer);
            setSelectedTradePoint(null);

            const customerId = 'id' in customer ? customer.id : customer.customerId;
            dispatch(fetchAllDebtsAsync({ customerId }));
        } else {
            setSelectedCustomer(null);
            dispatch(fetchAllDebtsAsync({}));
        }
    };

    const handleUpdate = () => {
        dispatch(updateDebts());
    };

    const totalDebt = useMemo(() => {
        return debts?.reduce((acc, debt) => acc + debt.sum, 0).toFixed(2);
    }, [debts, selectedTradePoint, selectedCustomer]);

    const handleResetFilters = () => {
        dispatch(fetchAllDebtsAsync({}));
    };

    const columns = useMemo<MRT_ColumnDef<DebtData, keyof DebtData>[]>(() => [
        {
            accessorKey: 'customerName',
            header: t('CustomerName'),
            minSize: 200,
            maxSize: 200,
            size: 200,
            Filter: () => (
                <div style={{ width: '320px', height: '32px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customersForDebts && customersForDebts.length > 0 && (
                        <CustomerInfoSelect
                            customersList={customersForDebts}
                            onSelect={handleSelectCustomer}
                            color='white'
                            width={320}
                            height={32}
                        />
                    )}
                    {customers && customers.length > 0 && !customersForDebts && (
                        <CustomerSelect
                            customersList={customers}
                            onSelect={handleSelectCustomer}
                            color='white'
                            width={320}
                            height={32}
                        />
                    )}
                </div>
            ),
            Cell: ({ cell }) => (
                <div style={{ width: '320px', height: '32px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cell.getValue() as string}
                </div>
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
                <>
                    {tradePointsForDebts && tradePointsForDebts.length > 0 && (
                        <TradePointSelect
                            tradePointsList={tradePointsForDebts}
                            onSelect={handleSelectTradePoint}
                            color='white'
                            width={320}
                            height={32}
                        />
                    )}
                    {tradePoints && tradePoints.length > 0 && !tradePointsForDebts && (
                        <TradePointSelect
                            tradePointsList={tradePoints}
                            onSelect={handleSelectTradePoint}
                            color='white'
                            width={320}
                            height={32}
                        />
                    )}
                </>
            ),
        },
        {
            accessorKey: 'docNumber',
            header: t('DocNumber'),
            minSize: 200,
            maxSize: 200,
            size: 200,
            grow: 0,
        },
        {
            accessorKey: 'sum',
            header: t('Sum'),
            minSize: 200,
            maxSize: 200,
            size: 200,
            grow: 0,
            sortingFn: 'basic',
            filterVariant: 'range',
            filterFn: 'between',
            Cell: ({ cell }) => cell.row.original.sum !== 0 ? cell.row.original.sum : '',
            Footer: () => <div style={{ fontSize: '15px' }}>{totalDebt}</div>,
        },
    ], [t, customers, tradePoints, customersForDebts, tradePointsForDebts, debts, totalDebt]);

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
                    rows={debts && debts.length > 0 ? debts : emptyResult}
                    enableFiltering={true}
                    enableFooter={true}
                    customRowHeight={49}
                    customHeaderHeight={176}
                    density='compact'
                />
            </div>
        );
    }
};

export default Debts;
