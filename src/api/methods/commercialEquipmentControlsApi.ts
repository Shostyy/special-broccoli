import { updatePending, updateFulfilled, updateRejected, resetState, fetchControlHistoryAsync } from '../../redux/slices/commercialEquipmentControlSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { CommercialEquipmentControl } from '../types/commercialEquipmentControl';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

const fetchDataUrl = `${BASE_URL}/api/commercial-equipment-controls`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-commercial-equipment-controls`;
const initializeUpdateUrl = `${BASE_URL}/api/commercial-equipment-controls/update/by-trade-point-id`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const commercialEquipmentControlsApi = {
  async getAllControlHistory(tradePointId: number): Promise<CommercialEquipmentControl[]> {
    const response = await fetchClientFullResponse.get<CommercialEquipmentControl[]>(`${fetchDataUrl}?tradePointId=${tradePointId}`);
    return response.data;
  },

  async getControlById(id: number): Promise<CommercialEquipmentControl> {
    const response = await fetchClientFullResponse.get<CommercialEquipmentControl>(`${fetchDataUrl}/${id}`);
    return response.data;
  },

  subscribeForUpdateControls(dispatch: any, tradePointId: number) {
    const updatedInitializeUpdateUrl = `${initializeUpdateUrl}/${tradePointId}`;

    subscribeForUpdates({
      eventSourceUrl,
      initializeUpdateUrl: updatedInitializeUpdateUrl,
      dispatch,
      updateAction: updatePending,
      fulfilledAction: updateFulfilled,
      rejectedAction: updateRejected,
      resetAction: resetState,
      // updateDataAction: fetchControlHistoryAsync,
      successDuration,
      errorDuration,
    });
  }
};

export default commercialEquipmentControlsApi;
