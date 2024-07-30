import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/debtsSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { DebtData } from '../types/debtData';

const fetchDataUrl = `${BASE_URL}/api/debts`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-debts`;
const initializeUpdateUrl = `${BASE_URL}/api/debts/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const debtsApi = {
    async getAllDebts(
        selectedTradePointId?: number,
        selectedCustomerId?: number,
    ): Promise<DebtData[]> {
        let url = fetchDataUrl;

        if (selectedTradePointId) {
            url = `${fetchDataUrl}/filtered?selectedTradePointId=${selectedTradePointId}`;
        } else if (selectedCustomerId) {
            url = `${fetchDataUrl}/filtered?selectedCustomerId=${selectedCustomerId}`;
        }

        const response = await fetchClientFullResponse.get<DebtData[]>(url);
        return response.data;
    },

    subscribeForUpdateDebts(dispatch: any) {
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

export default debtsApi;
