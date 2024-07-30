import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchClientFullResponse } from '../../../api/fetchClientFullResponse';
import { ADMIN_ROLE, BASE_URL, CLIENT_ROLE, OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION } from '../../../data/constants/constants';
import { OrderData } from '../../../api/types/orderData';
import { TradePointData } from '../../../api/types/tradePointData';
import { appIcons } from '../../../data/constants/icons';
import { updateOrder, updateOrders } from '../../../redux/slices/ordersSlice';
import { fetchOrders } from './utils/fetchOrders';
import { fetchTradePoints } from './utils/fetchTradePoints';
import { useColumns } from './hooks/useColumns';
import OrderDetailsDialog from './components/OrderDetailsPopup/OrdersDetailsPopup';
import NewOrderPopup from './components/NewOrderPopup/NewOrderPopup';
import { GeneralButton, SimpleTable, UpdateButton } from '../../../components/common';
import { ConfirmationModal } from '../../admin/Users/components/ConfirmationModal';
import ErrorSuccessModal from '../../admin/Users/components/ErrorSuccessModal/ErrorSuccessModal';
import dayjs from 'dayjs';
import { Box, CircularProgress, Typography } from '@mui/material';
import CircularProgressWithLabel from './components/CircularProgressWithLabel/CircularProgressWithLabel';
import TradePointMultiSelect from '../../../components/common/Selects/TradePointMultiSelect';

const Orders: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.login.userInfo);
    const { updateStatus } = useAppSelector(state => state.orders);
    const [tradePointsForOrders, setTradePointsForOrders] = useState<TradePointData[] | null>(null);
    const [tradePointIds, setTradePointIds] = useState<number[]>([]);
    const [ordersData, setOrdersData] = useState<OrderData[] | null>(null);
    const [filteredOrdersData, setFilteredOrdersData] = useState<OrderData[] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [isOrderModalOpened, setOrderModalOpened] = useState<boolean>(false);
    const [shouldRefetchOrders, setShouldRefetchOrders] = useState<boolean>(false);
    const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
    const [editOrder, setEditOrder] = useState<OrderData | null>(null);
    const [copyOrder, setCopyOrder] = useState<OrderData | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [orderSavedSuccessId, setOrderSavedSuccessId] = useState<number | null>(null);
    const [fetchCompleted, setFetchCompleted] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [selectedTradePoints, setSelectedTradePoints] = useState<TradePointData[]>([]);
    const [filters, setFilters] = useState({
        id: null,
        docNumber: '',
        tradePoint: '',
        dateCreatedStart: null as dayjs.Dayjs | null,
        dateCreatedEnd: null as dayjs.Dayjs | null,
        sumMin: '',
        sumMax: '',
        status: '',
        comment: '',
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchTradePoints(setTradePointsForOrders, setTradePointIds);
    }, []);

    useEffect(() => {
        if (orderSavedSuccessId && fetchCompleted) {
            const newOrder = ordersData?.find(order => order.id === orderSavedSuccessId);

            if (newOrder) {
                setSelectedOrder(newOrder);
                setOrderSavedSuccessId(null);
                setFetchCompleted(false);
            }
        }
    }, [orderSavedSuccessId, ordersData, fetchCompleted]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchOrders(tradePointIds, setOrdersData);
            setFetchCompleted(true);
        };

        if (shouldRefetchOrders) {
            fetchData();
            setShouldRefetchOrders(false);
        }

        if (tradePointIds.length < 100 && !ordersData) {
            fetchData();
        }
    }, [tradePointIds, shouldRefetchOrders]);

    useEffect(() => {
        if (ordersData) {
            let filtered = ordersData;
            const filterId = filters.id ?? '';
            if (filterId) {
                filtered = filtered.filter(order => order.id.toString().includes(filterId));
            }
            if (filters.docNumber) {
                filtered = filtered.filter(order => order.docNumber?.toLowerCase().includes(filters.docNumber.toLowerCase()));
            }
            if (filters.tradePoint) {
                filtered = filtered.filter(order => order.tradePoint.name.toLowerCase().includes(filters.tradePoint.toLowerCase()));
            }
            if (filters.dateCreatedStart) {
                filtered = filtered.filter(order => dayjs(order.dateCreated).isAfter(filters.dateCreatedStart));
            }
            if (filters.dateCreatedEnd) {
                filtered = filtered.filter(order => dayjs(order.dateCreated).isBefore(filters.dateCreatedEnd));
            }
            if (filters.sumMin) {
                filtered = filtered.filter(order => order.sum >= Number(filters.sumMin));
            }
            if (filters.sumMax) {
                filtered = filtered.filter(order => order.sum <= Number(filters.sumMax));
            }
            if (filters.status) {
                filtered = filtered.filter(order => order.status === filters.status);
            }
            if (filters.comment) {
                filtered = filtered.filter(order => order.comment.toLowerCase().includes(filters.comment.toLowerCase()));
            }
            setFilteredOrdersData(filtered);
        }
    }, [ordersData, filters]);

    const handleCloseOrderModalSuccess = useCallback((savedOrderId: number) => {
        setOrderModalOpened(false);
        setShouldRefetchOrders(true);
        setEditOrder(null);
        setCopyOrder(null);
        setOrderSavedSuccessId(savedOrderId);
    }, []);

    const handleCopyOrder = (order: OrderData) => {
        setCopyOrder(order);
        setOrderModalOpened(true);
    };

    const handleChangeOrder = (order: OrderData) => {
        setEditOrder(order);
        setOrderModalOpened(true);
    };

    const handleUpdateStatus = (order: OrderData) => {
        dispatch(updateOrder(order.id));
    };

    const handleDeleteOrder = (order: OrderData) => {
        if (order.status === 'DRAFT') {
            setDeleteOrderId(order.id);
        }
    };

    const confirmDeleteOrder = () => {
        if (deleteOrderId) {
            fetchClientFullResponse.delete(`${BASE_URL}/api/orders?orderId=${deleteOrderId}`)
                .then(() => {
                    setShouldRefetchOrders(prev => !prev);
                    setDeleteOrderId(null);
                    setSuccessMessage('OrderDeleted');

                    setTimeout(() => {
                        setSuccessMessage('');
                    }, OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION);
                })
                .catch(error => console.error('Error deleting order:', error));
        }
    };

    const [toManyTpError, setToManyTpError] = useState<string | null>(null);

    console.log(toManyTpError);

    const handleUpdate = () => {
        if (userInfo?.role.name === CLIENT_ROLE) {
            dispatch(updateOrders(tradePointIds));
        }
        if (userInfo?.role.name === ADMIN_ROLE) {
            if (ordersData) {
                if (tradePointIds.length < 100) {
                    dispatch(updateOrders(tradePointIds));
                } else if (selectedTradePoints && selectedTradePoints.length > 0) {
                    const idsToUpdate = selectedTradePoints.length > 0 ? selectedTradePoints.map(tp => tp.id) : [];
                    dispatch(updateOrders(idsToUpdate));
                } else {
                    setToManyTpError('Оберіть торгові точки для оновлення');

                    setTimeout(() => {
                        setToManyTpError(null);
                    }, 2500);
                }
            } else {
                setToManyTpError('Необхідно завантажити дані перед оновленням');

                setTimeout(() => {
                    setToManyTpError(null);
                }, 2500);
            }

        }

    };

    const handleOpenOrderModal = () => {
        setOrderModalOpened(true);
    };

    const handleCloseOrderModal = () => {
        setOrderModalOpened(false);
        setEditOrder(null);
        setCopyOrder(null);
    };

    const handleResetFilters = () => {
        setFilters({
            id: null,
            docNumber: '',
            tradePoint: '',
            dateCreatedStart: null,
            dateCreatedEnd: null,
            sumMin: '',
            sumMax: '',
            status: '',
            comment: '',
        });
    };

    const handleCloseDetailsModal = () => {
        setSelectedOrder(null);
        setOrderModalOpened(false);
        setEditOrder(null);
        setCopyOrder(null);
        setShouldRefetchOrders(false);
        setOrderSavedSuccessId(null);
    };

    const columns = useColumns({
        handleCopyOrder,
        handleChangeOrder,
        handleUpdateStatus,
        handleDeleteOrder,
        filters,
        handleFilterChange,
        userInfo,
    });

    const handleSelect = (selected: TradePointData[] | null) => {
        setSelectedTradePoints(selected || []);
    };

    const handleLoadData = () => {
        const idsToFetch = selectedTradePoints.length > 0 ? selectedTradePoints.map(tp => tp.id) : [];
        fetchOrders(idsToFetch, setOrdersData, setProgress).then(() => setFetchCompleted(true));
    };

    const handleLoadAll = () => {
        setFetchCompleted(false);
        fetchOrders(tradePointIds, setOrdersData, setProgress).then(() => setFetchCompleted(true));
    }

    const renderTradePointSelect = () => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <TradePointMultiSelect
                    tradePointsList={tradePointsForOrders || []}
                    onSelect={(tpList) => handleSelect(tpList)}
                    height={50}
                    width={350}
                    color='red'
                    selectedTradePointList={selectedTradePoints || []}
                />
                <GeneralButton
                    onClick={handleLoadData}
                    width={210}
                    translationKey='LoadSelected'
                    disabled={selectedTradePoints && selectedTradePoints.length === 0}
                />
                <GeneralButton
                    onClick={handleLoadAll}
                    width={180}
                    translationKey='LoadAll'
                    disabled={progress > 0 && progress < 100 && !fetchCompleted}
                />
            </Box>
        );
    };

    return (
        <div style={{ height: '90%', width: '100%' }}>
            <OrderDetailsDialog
                order={selectedOrder}
                onClose={handleCloseDetailsModal}
            />

            <div className='mb-4 flex justify-between overflow-hidden'>
                <div>
                    {userInfo?.role.name === CLIENT_ROLE && (
                        <GeneralButton
                            translationKey='CreateNewOrder'
                            onClick={handleOpenOrderModal}
                            icon={appIcons.addRed}
                            width={350}
                        />
                    )}
                    {userInfo?.role.name === ADMIN_ROLE
                        && tradePointsForOrders
                        && tradePointsForOrders.length > 100
                        && renderTradePointSelect()}

                </div>

                <div className="flex gap-2">
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

            {isOrderModalOpened && tradePointsForOrders && (
                <NewOrderPopup
                    isOpen={isOrderModalOpened}
                    onClose={handleCloseOrderModal}
                    onSuccess={handleCloseOrderModalSuccess}
                    tradePointsForOrders={tradePointsForOrders}
                    editOrder={editOrder}
                    copyOrder={copyOrder}
                />
            )}
            {deleteOrderId && (
                <ConfirmationModal
                    message={t('DeleteOrderConfirm')}
                    onConfirm={confirmDeleteOrder}
                    onCancel={() => setDeleteOrderId(null)}
                />
            )}

            {userInfo?.role.name === ADMIN_ROLE
                && tradePointsForOrders && tradePointsForOrders.length > 100
                && !ordersData ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        height: '100%',
                        paddingTop: '20vh',
                        bgcolor: '#fff',
                        borderRadius: '16px',
                    }}
                >
                    <Typography
                        variant="body2"
                        component="div"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {t('SelectTradePoints')}
                    </Typography>
                </Box>
            ) : tradePointIds.length > 100
                && !fetchCompleted && progress < 100 && progress > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        height: '100%',
                        paddingTop: '20vh',
                        bgcolor: '#fff',
                        borderRadius: '16px',
                    }}
                >
                    <CircularProgressWithLabel
                        value={progress}
                    />
                </Box>
            ) : ordersData ? (
                <SimpleTable
                    columns={columns}
                    rows={filteredOrdersData || []}
                    enableFiltering={true}
                    customRowHeight={49}
                    customHeaderHeight={165}
                    onRowClick={(row) => setSelectedOrder(row)}
                    density='compact'
                    enableGlobalFilter={false}
                    defaultSorting={['dateCreated', 'desc']}
                />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        height: '100%',
                        paddingTop: '20vh',
                        bgcolor: '#fff',
                        borderRadius: '16px',
                    }}
                >
                    <CircularProgress color="error" />
                </Box>
            )}

            {successMessage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={t(successMessage)}
                />
            )}
            {toManyTpError && (
                <ErrorSuccessModal
                    messageType='error'
                    message={t(toManyTpError)}
                />
            )}
        </div>
    );
};

export default Orders;
