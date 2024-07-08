import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/ordersSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { TradePointData } from '../types/tradePointData';
import { subscribeForUpdates } from './subscribeForUpdates';

const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-orders`;
const initializeUpdateUrl = `${BASE_URL}/api/orders/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

/**
 const fetchAllOrdersByTradePoints = async (tradePointsForOrders: TradePointData[] | null, userInfo: UserInfo | null): Promise<OrderData[] | undefined> => {
    const tradePointIds = tradePointsForOrders
        ? tradePointsForOrders.map(tradePoint => tradePoint.id)
        : (userInfo?.role.name === ADMIN_ROLE ? TP_3000 : []);

    if (tradePointIds.length > 0) {
        try {
            const res = await fetchClientFullResponse.post<OrderData[]>(`${BASE_URL}/api/orders/by-trade-point-ids`, tradePointIds, 'application/json');
            console.log('Orders fetched.');
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }
};
 
 */
const ordersApi = {
  async getTradePointForOrders(): Promise<TradePointData[]> {
    try {
      const response = await fetchClientFullResponse.get<TradePointData[]>(`${BASE_URL}/api/trade-points/for-orders`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getOrdersByTradePoints(tradePointIds: number[]): Promise<TradePointData[]> {
    try {
      const response = await fetchClientFullResponse.post<TradePointData[]>(`${BASE_URL}/api/orders/by-trade-point-ids`, tradePointIds);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  subscribeForUpdateOrders(dispatch: any) {
    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      successDuration,
      errorDuration,
    });
  },
  subscribeForUpdateOrder(dispatch: any, orderId: number) {
    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl: `${initializeUpdateUrl}/${orderId}`,
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
