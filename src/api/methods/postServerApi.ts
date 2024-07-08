import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { PostServerConfig } from '../types/postServerConfig';

const postServerApi = {
    async fetchAllConfigs(): Promise<PostServerConfig[]> {
        try {
            const response = await fetchClientFullResponse.get<PostServerConfig[]>(`${BASE_URL}/api/postserver`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async fetchCurrentConfig(): Promise<PostServerConfig>  {
        try {
            const response = await fetchClientFullResponse.get<PostServerConfig>(`${BASE_URL}/api/postserver/active`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async createConfig() {
        try {
            const response = await fetchClientFullResponse.post<number>(`${BASE_URL}/api/postserver/create`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async deleteConfig(idToDelete: number) {
        try {
            const response = await fetchClientFullResponse.delete(`${BASE_URL}/api/postserver/${idToDelete}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async updateConfig(updatedConfig: PostServerConfig) {
        try {
            const response = await fetchClientFullResponse.post(`${BASE_URL}/api/postserver`, updatedConfig, 'application/json');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async updateCurrent(newCurrentConfigId: number) {
        try {
            const response = await fetchClientFullResponse.put(`${BASE_URL}/api/postserver/active/${newCurrentConfigId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default postServerApi;
