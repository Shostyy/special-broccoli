import { RegisterNewUserData } from '../../../../api/postTypes/registerNewUserData';
import { Role } from '../../../../api/types/role';
import { RegisterFormValues } from '../types/register.types';

export const transformValues = (values: RegisterFormValues, allRoles: Role[]): RegisterNewUserData => {
    const role = allRoles.find(role => role.name === values.role);
    if (!role) {
        throw new Error('Role not found');
    }

    return {
        login: values.login,
        email: values.email,
        role: {
            id: role.id,
            name: role.name,
        },
    };
};