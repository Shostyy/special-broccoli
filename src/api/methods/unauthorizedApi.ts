import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { CompleteRegistrationData } from '../postTypes/completeRegistrationData';
import { ResetPasswordUnauthorizedData } from '../postTypes/resetPasswordUnauthorizedData';

const unauthorizedApi = {
    async completeRegistration(authData: CompleteRegistrationData) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/complete-registration`, authData, 'application/json');
    },

    async resetPasswordInit(email: string) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/forgot-password`, email, 'text/plain')
    },

    async resetPassword(data: ResetPasswordUnauthorizedData) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/reset-password`, data, 'application/json')
    },
}

export default unauthorizedApi;
