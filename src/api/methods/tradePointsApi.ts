import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/tradePointsSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { subscribeForUpdates } from './subscribeForUpdates';
import { TradePointData } from '../types/tradePointData';

const fetchDataUrl = `${BASE_URL}/api/trade-points`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-trade-points`;
const initializeUpdateUrl = `${BASE_URL}/api/trade-points/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const tradePointsApi = {
  async getAllTradePoints(): Promise<TradePointData[]> {
    try {
      const response = await fetchClientFullResponse.get<TradePointData[]>(fetchDataUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribeForUpdateTradePoints(dispatch: any) {
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
    })
  }
}

export default tradePointsApi