import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/customersSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { CustomerData } from '../types/customerData';

const fetchDataUrl = `${BASE_URL}/api/customers`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-customers`;
const initializeUpdateUrl = `${BASE_URL}/api/customers/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const customersApi = {
  async getAllCustomers(): Promise<CustomerData[]> {
    try {
      const response = await fetchClientFullResponse.get<CustomerData[]>(fetchDataUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribeForUpdateCustomers(dispatch: any) {
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

export default customersApi;