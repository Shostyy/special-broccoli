import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { ChangeEmailData } from '../postTypes/changeEmailData';
import { ChangePasswordData } from '../postTypes/changePasswordData';

const userApi = {
    async changeEmail(changeEmailValues: ChangeEmailData) {
        await fetchClientFullResponse.put(`${BASE_URL}/api/users/change-email/${changeEmailValues.id}`, changeEmailValues.email, 'text/plain')
    },

    async changePassword(changePasswordValues: ChangePasswordData) {
        await fetchClientFullResponse.put(`${BASE_URL}/api/users/change-password`, changePasswordValues, 'application/json')
    },
}

export default userApi;
