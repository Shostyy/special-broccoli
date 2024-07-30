import { updatePending, updateFulfilled, updateRejected, resetState, fetchMaterialsAsync } from '../../redux/slices/materialsSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { MaterialData } from '../types/materialData';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

const fetchDataUrl = `${BASE_URL}/api/materials`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-materials`;
const initializeUpdateUrl = `${BASE_URL}/api/materials/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const materialsApi = {
  async getAllMaterials(): Promise<MaterialData[]> {
    const response = await fetchClientFullResponse
      .get<MaterialData[]>(fetchDataUrl);

    return response.data;
  },

  subscribeForUpdateMaterials(dispatch: any) {
    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      updateDataAction: fetchMaterialsAsync,
      successDuration,
      errorDuration,
    });
  },
}

export default materialsApi;