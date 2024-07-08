import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { Role } from '../types/role';

const rolesApi = {
    async addRole(roleNameToAdd: string) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/role`, roleNameToAdd, 'text/plain');
        } catch (error) {
            throw error;
        }
    },
    async deleteRole(roleIdToDelete: number) {
        try {
            await fetchClientFullResponse.delete(`${BASE_URL}/api/role?roleId=${roleIdToDelete}`);
        } catch (error) {
            throw error;
        }
    },
    async getAllRoles(): Promise<Role[]> {
        try {
            const response = await fetchClientFullResponse.get<Role[]>(`${BASE_URL}/api/users/roles`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default rolesApi;
