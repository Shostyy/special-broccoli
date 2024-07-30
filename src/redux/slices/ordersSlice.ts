import { createSlice } from '@reduxjs/toolkit';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { OrderData } from '../../api/types/orderData';
import ordersApi from '../../api/methods/ordersApi';

export interface OrdersState extends ExtendedUpdateSliceState {
    orders: OrderData[] | null;
}

const initialState: OrdersState = createExtendedUpdateState({
    orders: null,
});

export const updateOrders = (tpIds: number[]) => {
    return (dispatch: any) => {
        ordersApi.subscribeForUpdateOrders(dispatch, tpIds);
    };
}

export const updateOrder = (orderId: number) => {
    return (dispatch: any) => {
        ordersApi.subscribeForUpdateOrder(dispatch, orderId);
    };
}

const ordersSlice = createSlice({
    name: 'ordersSlice',
    initialState,
    reducers: {
        resetState: (state) => {
            state.updateStatus = 'idle';
            state.updateMessage = null;
        },
        updatePending: (state) => {
            state.updateStatus = 'pending';
            state.updateMessage = 'OrdersUpdPending';
        },
        updateFulfilled: (state) => {
            state.updateStatus = 'success';
            state.updateMessage = 'OrdersUpdSuccess';
        },
        updateRejected: (state) => {
            state.updateStatus = 'error';
            state.updateMessage = 'OrdersUpdError';
        },
    },
});

export const {
    resetState,
    updatePending,
    updateFulfilled,
    updateRejected,
} = ordersSlice.actions;

export default ordersSlice.reducer;
