import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { RegisterNewUserData } from '../postTypes/registerNewUserData';

const registerApi = {
    async register(userToRegisterData: RegisterNewUserData) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/users/register`, userToRegisterData, 'application/json');
        } catch (error) {
            throw error;
        }
    }
}

export default registerApi;
