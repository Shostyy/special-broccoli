import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserInfo } from '../types/userInfo';

const editUserApi = {
    async editUser(userToEdit: any) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/users/save`, userToEdit, 'application/json');
        } catch (error) {
            throw error;
        }
    },

    async toggleUserBlock(userToToggle: UserInfo) {
        try {
            await fetchClientFullResponse.put(`${BASE_URL}/api/users/block/${userToToggle.id}`, userToToggle.blocked, 'application/json')
        } catch (error) {
            throw error;
        }
    },

    async deleteUser(userIdToDelete: number) {
        try {
            fetchClientFullResponse.delete(`${BASE_URL}/api/users?userId=${userIdToDelete}`)
        } catch (error) {
            throw error;
        }
    }
}

export default editUserApi;
