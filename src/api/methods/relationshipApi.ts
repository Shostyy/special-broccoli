import { BASE_URL } from '../../data/constants/constants';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { UserRelationshipInfo } from '../types/userRelationshipInfo';

const relationshipApi = {
    async deleteRelationship(relationshipToDelete: UserRelationshipInfo) {
        await fetchClientFullResponse.delete(`${BASE_URL}/api/users/user-customers`, relationshipToDelete, 'application/json');
    },

    async addRelationship(relationshipToAdd: UserRelationshipInfo) {
        await fetchClientFullResponse.post(`${BASE_URL}/api/users/user-customers`, relationshipToAdd, 'application/json');
    },
}

export default relationshipApi;
