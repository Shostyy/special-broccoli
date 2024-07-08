import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { CompleteRegistrationData } from '../postTypes/completeRegistrationData';
import { ResetPasswordUnauthorizedData } from '../postTypes/resetPasswordUnauthorizedData';

const unauthorizedApi = {
    async completeRegistration(authData: CompleteRegistrationData) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/complete-registration`, authData, 'application/json');
        } catch (error) {
            throw error;
        }
    },

    async resetPasswordInit(email: string) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/forgot-password`, email, 'text/plain')
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(data: ResetPasswordUnauthorizedData) {
        try {
            await  fetchClientFullResponse.post(`${BASE_URL}/api/reset-password`, data, 'application/json')
        } catch (error) {
            throw error;
        }
    }
}

export default unauthorizedApi;
