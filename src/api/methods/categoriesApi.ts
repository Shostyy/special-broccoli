import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/categoriesSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { subscribeForUpdates } from './subscribeForUpdates';
import { CategoryData } from '../types/categoryData';

const fetchDataUrl = `${BASE_URL}/api/categories`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-categories`;
const initializeUpdateUrl = `${BASE_URL}/api/categories/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const categoriesApi = {
  async getAllCategories(): Promise<CategoryData[]> {
    try {
      const response = await fetchClientFullResponse.get<CategoryData[]>(fetchDataUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribeForUpdateCategories(dispatch: any) {
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
}

export default categoriesApi;
