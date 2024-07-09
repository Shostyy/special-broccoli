import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchClientFullResponse } from '../../../api/fetchClientFullResponse';
import { BASE_URL, CLIENT_ROLE } from '../../../data/constants/constants';
import { OrderData } from '../../../api/types/orderData';
import { TradePointData } from '../../../api/types/tradePointData';
import { appIcons } from '../../../data/constants/icons';
import { updateOrder, updateOrders } from '../../../redux/slices/ordersSlice';
import { fetchOrders } from './utils/fetchOrders';
import { fetchTradePoints } from './utils/fetchTradePoints';
import { useCurrentTableLocale } from '../../../hooks/useCurrentTableLocale';
import { useColumns } from './hooks/useColumns';
import OrderDetailsDialog from './components/OrderDetailsPopup/OrdersDetailsPopup';
import NewOrderPopup from './components/NewOrderPopup/NewOrderPopup';
import { GeneralButton, SimpleTable, UpdateButton } from '../../../components/common';
import { ConfirmationModal } from '../../admin/Users/components/ConfirmationModal';
import ErrorSuccessModal from '../../admin/Users/components/ErrorSuccessModal/ErrorSuccessModal';

const Orders: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.login.userInfo);
    const { updateStatus } = useAppSelector(state => state.orders);

    const [tradePointsForOrders, setTradePointsForOrders] = useState<TradePointData[] | null>(null);
    const [tradePointIds, setTradePointIds] = useState<number[]>([]);
    const [ordersData, setOrdersData] = useState<OrderData[] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [isOrderModalOpened, setOrderModalOpened] = useState<boolean>(false);
    const [shouldRefetchOrders, setShouldRefetchOrders] = useState<boolean>(false);
    const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
    const [editOrder, setEditOrder] = useState<OrderData | null>(null);
    const [copyOrder, setCopyOrder] = useState<OrderData | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchTradePoints(setTradePointsForOrders, setTradePointIds);
    }, []);

    useEffect(() => {
        if (tradePointIds.length > 0) {
            fetchOrders(tradePointIds, setOrdersData);
        }

        if (shouldRefetchOrders) {
            fetchOrders(tradePointIds, setOrdersData);
            setShouldRefetchOrders(false);
        }
    }, [tradePointIds, shouldRefetchOrders]);

    const handleCloseOrderModalSuccess = useCallback(() => {
        setOrderModalOpened(false);
        setShouldRefetchOrders(true);
        setEditOrder(null);
        setCopyOrder(null);
        setSuccessMessage('GeneralSaveSuccess');

        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
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
                    }, 3000);
                })
                .catch(error => console.error('Error deleting order:', error));
        }
    };

    const handleUpdate = () => {
        dispatch(updateOrders());
    };

    const handleOpenOrderModal = () => {
        setOrderModalOpened(true);
    };

    const handleCloseOrderModal = () => {
        setOrderModalOpened(false);
        setEditOrder(null);
        setCopyOrder(null);
    };

    const columns = useColumns({
        handleCopyOrder,
        handleChangeOrder,
        handleUpdateStatus,
        handleDeleteOrder,
    });

    return (
        <div style={{ height: '90%', width: '100%' }}>
            <OrderDetailsDialog
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
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
                </div>
                <UpdateButton
                    onClick={handleUpdate}
                    updateStatus={updateStatus}
                />
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
                    message={t("DeleteOrderConfirm")}
                    onConfirm={confirmDeleteOrder}
                    onCancel={() => setDeleteOrderId(null)}
                />
            )}
            {ordersData && (
                <SimpleTable
                    columns={columns}
                    rows={ordersData}
                    enableFiltering={true}
                    customRowHeight={49}
                    customHeaderHeight={224}
                    onRowClick={(row) => setSelectedOrder(row)}
                    density='compact'
                />
            )}
            {successMessage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={t(successMessage)}
                />
            )}
        </div>
    );
};

export default Orders;
