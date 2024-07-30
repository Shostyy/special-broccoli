import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserInfo } from '../types/userInfo';

const loginApi = {
    async login(authData: { username: string; password: string }) {
        await fetchClientFullResponse.post(`${BASE_URL}/login`, authData);
    },

    async logOut() {
        sessionStorage.clear();
        const response = await fetchClientFullResponse.post(`${BASE_URL}/logout`);
        return response;
    },

    async fetchUserInfo(): Promise<UserInfo> {
        const response = await fetchClientFullResponse.get<UserInfo>(BASE_URL);
        return response.data;
    },
}

export default loginApi;
