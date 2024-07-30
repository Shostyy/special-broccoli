import { updatePending, updateFulfilled, updateRejected, resetState, fetchBranchOfficesAsync } from '../../redux/slices/branchOfficesSlice';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { BranchOffice } from '../types/branchOffice';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

const fetchDataUrl = `${BASE_URL}/api/branch-offices`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-branch-offices`;
const initializeUpdateUrl = `${BASE_URL}/api/branch-offices/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const branchOfficeApi = {
    async getAllBranchOffices(): Promise<BranchOffice[]> {
        const response = await fetchClientFullResponse
            .get<BranchOffice[]>(fetchDataUrl);

        return response.data;
    },

    subscribeForUpdateBranchOffices(dispatch: any) {
        subscribeForUpdates({
            eventSourceUrl,
            initializeUpdateUrl,
            dispatch,
            updateAction: updatePending,
            fulfilledAction: updateFulfilled,
            rejectedAction: updateRejected,
            resetAction: resetState,
            updateDataAction: fetchBranchOfficesAsync,
            successDuration,
            errorDuration,
        });
    },
}

export default branchOfficeApi;
