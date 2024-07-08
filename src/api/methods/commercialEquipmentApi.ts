import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/commercialEquipmentSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { CommercialEquipment } from '../types/commercialEquipment';
import { subscribeForUpdates } from './subscribeForUpdates';

const fetchDataUrl = `${BASE_URL}/api/commercial-equipments`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-commercial-equipments`;
const initializeUpdateUrl = `${BASE_URL}/api/commercial-equipments/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const commercialEquipmentApi = {
  async getAllCommercialEquipment(): Promise<CommercialEquipment[]> {
    try {
      const response = await fetchClientFullResponse.get<CommercialEquipment[]>(fetchDataUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribeForUpdateCommercialEquipment(dispatch: any) {
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

export default commercialEquipmentApi;
