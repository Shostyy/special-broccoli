import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { PostServerConfig } from '../types/postServerConfig';

const postServerApi = {
    async fetchAllConfigs(): Promise<PostServerConfig[]> {
        const response = await fetchClientFullResponse.get<PostServerConfig[]>(`${BASE_URL}/api/postserver`);
        return response.data;
    },
    async fetchCurrentConfig(): Promise<PostServerConfig> {
        const response = await fetchClientFullResponse.get<PostServerConfig>(`${BASE_URL}/api/postserver/active`);
        return response.data;
    },
    async createConfig() {
        const response = await fetchClientFullResponse.post<number>(`${BASE_URL}/api/postserver/create`);
        return response.data;
    },
    async deleteConfig(idToDelete: number) {
        const response = await fetchClientFullResponse.delete(`${BASE_URL}/api/postserver/${idToDelete}`);
        return response.data;
    },
    async updateConfig(updatedConfig: PostServerConfig) {
        const response = await fetchClientFullResponse.post(`${BASE_URL}/api/postserver`, updatedConfig, 'application/json');
        return response.data;
    },
    async updateCurrent(newCurrentConfigId: number) {
        const response = await fetchClientFullResponse.put(`${BASE_URL}/api/postserver/active/${newCurrentConfigId}`);
        return response.data;
    },
}

export default postServerApi;
