import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { ChangeEmailData } from '../postTypes/changeEmailData';
import { ChangePasswordData } from '../postTypes/changePasswordData';

const userApi = {
    async changeEmail(changeEmailValues: ChangeEmailData) {
        try {
            await fetchClientFullResponse.put(`${BASE_URL}/api/users/change-email/${changeEmailValues.id}`, changeEmailValues.email, 'text/plain')
        } catch (error) {
            throw error;
        }
    },

    async changePassword(changePasswordValues: ChangePasswordData) {
        try {
            await fetchClientFullResponse.put(`${BASE_URL}/api/users/change-password`, changePasswordValues, 'application/json')
        } catch (error) {
            throw error;
        }
    }
}

export default userApi;
