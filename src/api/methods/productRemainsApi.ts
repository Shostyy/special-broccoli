import { updatePending, updateFulfilled, updateRejected, resetState } from '../../redux/slices/productsRemains';
import { BASE_URL, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../data/constants/constants';
import { subscribeForUpdates } from './subscribeForUpdates';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { ProductsRemain } from '../types/productsRemain';
import { subscribeForUpdatesNoActions } from './subscribeForUpdatesNoActions';

const fetchDataUrl = `${BASE_URL}/api/product-remains/by-branch-office`;
const eventSourceUrl = `${BASE_URL}/sse/subscribe/update-product-remains`;
const initializeUpdateUrl = `${BASE_URL}/api/product-remains/update`;
const successDuration = BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION;
const errorDuration = BOTTOM_RIGHT_ERROR_MESSAGE_DURATION;

const productRemainsApi = {
    async getAllProductRemainsByBranchOfficeId(branchOfficeId: number): Promise<ProductsRemain[]> {
        try {
            const response = await fetchClientFullResponse.get<ProductsRemain[]>(`${fetchDataUrl}/${branchOfficeId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    subscribeForUpdateProductRemains(dispatch: any, branchOfficeId: number) {
        subscribeForUpdates({
            eventSourceUrl,
            initializeUpdateUrl: `${initializeUpdateUrl}/${branchOfficeId}`,
            dispatch,
            updateAction: updatePending,
            fulfilledAction: updateFulfilled,
            rejectedAction: updateRejected,
            resetAction: resetState,
            successDuration,
            errorDuration,
        });
    },

    subscribeForUpdateProductRemainsNoActions(branchOfficeId: number): Promise<void> {
        return subscribeForUpdatesNoActions({
            eventSourceUrl,
            initializeUpdateUrl: `${initializeUpdateUrl}/${branchOfficeId}`
        });
    }
}

export default productRemainsApi;