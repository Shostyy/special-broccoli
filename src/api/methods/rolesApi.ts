import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { Role } from '../types/role';

const rolesApi = {
    async addRole(roleNameToAdd: string) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/role`, roleNameToAdd, 'text/plain');
    },
    async deleteRole(roleIdToDelete: number) {
        await fetchClientFullResponse.delete(`${BASE_URL}/api/role?roleId=${roleIdToDelete}`);
    },
    async getAllRoles(): Promise<Role[]> {
        const response = await fetchClientFullResponse.get<Role[]>(`${BASE_URL}/api/users/roles`);
        return response.data;
    },
}

export default rolesApi;
