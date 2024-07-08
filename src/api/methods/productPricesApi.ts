import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/productPricesSlice';
import {
    updatePending as updatePendingForOrders,
    updateFulfilled as updateFulfilledForOrders,
    updateRejected as updateRejectedForOrders,
    resetState as resetStateForOrders
} from '../../redux/slices/productPricesSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { ProductPrice } from '../types/productPrice';
import { subscribeForUpdatesNoActions } from './subscribeForUpdatesNoActions';

const fetchDataUrl = `${BASE_URL}/api/product-prices/by-trade-point`;
const fetchPresentDataUrl = `${BASE_URL}/api/product-prices/for-order`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-product-prices`;
const initializeUpdateUrl = `${BASE_URL}/api/product-prices/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const productPricesApi = {
    async getAllProductPricesByTradePointId(tradePointId: number): Promise<ProductPrice[]> {
        try {
            const response = await fetchClientFullResponse.get<ProductPrice[]>(`${fetchDataUrl}/${tradePointId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getAllPresentProductPricesForOrdersByTradePointId(tradePointId: number): Promise<ProductPrice[]> {
        try {
            const response = await fetchClientFullResponse.get<ProductPrice[]>(`${fetchPresentDataUrl}/${tradePointId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    subscribeForUpdateProductPrices(dispatch: any, tradePointId: number, forOrders?: boolean) {
        subscribeForUpdates({
            eventSourceUrl,
            initializeUpdateUrl: `${initializeUpdateUrl}/${tradePointId}`,
            dispatch,
            updateAction: forOrders ? updatePendingForOrders : updatePending,
            fulfilledAction: forOrders ? updateFulfilledForOrders : updateFulfilled,
            rejectedAction: forOrders ? updateRejectedForOrders : updateRejected,
            resetAction: forOrders ? resetStateForOrders : resetState,
            successDuration,
            errorDuration,
        });
    },

    subscribeForUpdateProductPricesNoActions(tradePointId: number): Promise<void> {
        return subscribeForUpdatesNoActions({
            eventSourceUrl,
            initializeUpdateUrl: `${initializeUpdateUrl}/${tradePointId}`
        }
        );
    }
}

export default productPricesApi;