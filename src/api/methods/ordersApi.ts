import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/ordersSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { TradePointData } from '../types/tradePointData';
import { subscribeForUpdates } from './subscribeForUpdates';

const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-order-status`;
const eventSourceUrlByTp = `${BASE_URL}/sse/subscribe/update-orders-by-trade-point-ids`;
const initializeUpdateUrl = `${BASE_URL}/api/orders/update-orders-by-trade-point-ids`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const ordersApi = {
  async getTradePointForOrders(): Promise<TradePointData[]> {
    const response = await fetchClientFullResponse.get<TradePointData[]>(`${BASE_URL}/api/trade-points/for-orders`);
    return response.data;
  },

  async getOrdersByTradePoints(
    tradePointIds: number[],
  ): Promise<TradePointData[]> {
    const response = await fetchClientFullResponse.post<TradePointData[]>(`${BASE_URL}/api/orders/by-trade-point-ids`, tradePointIds);
    return response.data;
  },

  subscribeForUpdateOrders(dispatch: any, tradePointsIds: number[]) {
    subscribeForUpdates({
      eventSourceUrl: eventSourceUrlByTp,
      initializeUpdateUrl,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      successDuration,
      errorDuration,
      requestBody: tradePointsIds,
    });
  },
  subscribeForUpdateOrder(dispatch: any, orderId: number) {
    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl: `${BASE_URL}/api/orders/order/update-status/${orderId}`,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      successDuration,
      errorDuration,
    });
  },
}

export default ordersApi;
