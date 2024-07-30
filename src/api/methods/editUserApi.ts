import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserInfo } from '../types/userInfo';

const editUserApi = {
    async editUser(userToEdit: any) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/users/save`, userToEdit, 'application/json');
    },

    async toggleUserBlock(userToToggle: UserInfo) {
        await fetchClientFullResponse.put(`${BASE_URL}/api/users/block/${userToToggle.id}`, userToToggle.blocked, 'application/json')
    },

    async deleteUser(userIdToDelete: number) {
        await fetchClientFullResponse.delete(`${BASE_URL}/api/users?userId=${userIdToDelete}`)
    },
}

export default editUserApi;
