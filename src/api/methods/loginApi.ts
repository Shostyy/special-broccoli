import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserInfo } from '../types/userInfo';

const loginApi = {
    async login(authData: { username: string; password: string }) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/login`, authData);
        } catch (error) {
            throw error;
        }
    },

    async logOut() {
        try {
            const response = await fetchClientFullResponse.post(`${BASE_URL}/logout`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async fetchUserInfo(): Promise<UserInfo> {
        try {
            const response = await fetchClientFullResponse.get<UserInfo>(BASE_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default loginApi;
