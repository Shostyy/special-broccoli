import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserRelationshipInfo } from '../types/userRelationshipInfo';

const relationshipApi = {
    async deleteRelationship(relationshipToDelete: UserRelationshipInfo) {
        try {
            await fetchClientFullResponse.delete(`${BASE_URL}/api/users/user-customers`, relationshipToDelete, 'application/json');
        } catch (error) {
            throw error;
        }
    },

    async addRelationship(relationshipToAdd: UserRelationshipInfo) {
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/users/user-customers`, relationshipToAdd, 'application/json');
        } catch (error) {
            throw error;
        }
    }
}

export default relationshipApi;
