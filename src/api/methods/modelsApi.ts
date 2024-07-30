import { updatePending, updateFulfilled, updateRejected, resetState, fetchModelsAsync } from '../../redux/slices/modelSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { ModelData } from '../types/modelData';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

const fetchDataUrl = `${BASE_URL}/api/models`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-models`;
const initializeUpdateUrl = `${BASE_URL}/api/models/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const modelsApi = {
  async getAllModels(): Promise<ModelData[]> {
    const response = await fetchClientFullResponse
      .get<ModelData[]>(fetchDataUrl);

    return response.data;
  },

  subscribeForUpdateModels(dispatch: any) {
    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      updateDataAction: fetchModelsAsync,
      successDuration,
      errorDuration,
    });
  },
}

export default modelsApi;
