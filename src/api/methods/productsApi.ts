import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/productsSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { ProductData } from '../types/productData';

const fetchDataUrl = `${BASE_URL}/api/products`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-products`;
const initializeUpdateUrl = `${BASE_URL}/api/products/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const productsApi = {
  async getAllProducts(): Promise<ProductData[]> {
    try {
      const response = await fetchClientFullResponse.get<ProductData[]>(fetchDataUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribeForUpdateProducts(dispatch: any) {
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
  }
}

export default productsApi;