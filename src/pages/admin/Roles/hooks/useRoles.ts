import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ADMIN_ROLE, CLIENT_ROLE, RESPONSE_FAILED_TO_DELETE } from '../../../../data/constants/constants';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { fetchAllRoles } from '../../../../redux/slices/registerNewUserSlice';
import rolesApi from '../../../../api/methods/rolesApi';

interface FormValues {
    roleName: string;
}

export const useRoles = () => {
    const dispatch = useAppDispatch();
    const allRoles = useAppSelector((state) => state.register.allRoles);
    const { t } = useTranslation();
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
    const [createSuccessMessage, setCreateSuccessMessage] = useState<string | null>(null);
    const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchAllRoles());
    }, [dispatch]);

    const handleDelete = (roleId: number, roleName: string) => {
        if (selectedRoleId !== null) {
            if (roleName === ADMIN_ROLE || roleName === CLIENT_ROLE) {
                setDeleteErrorMessage(t('CannotDeleteRole'));
                setDeleteSuccessMessage(null);
                return;
            }
            rolesApi.deleteRole(roleId)
                .then(() => {
                    setDeleteSuccessMessage(t('RoleDelSuccess'));
                    setDeleteErrorMessage(null);
                    setSelectedRoleId(null);
                    dispatch(fetchAllRoles());
                })
                .catch((error: any) => {
                    if (error.response && error.response.status === RESPONSE_FAILED_TO_DELETE) {
                        setDeleteErrorMessage(t('CannotDeleteRelatedRole'));
                    } else {
                        setDeleteErrorMessage(t('FailedToDeleteRole'));
                        console.error('Delete role error:', error);
                    }
                    setDeleteSuccessMessage(null);
                });
        }
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            roleName: '',
        },
        validationSchema: Yup.object({
            roleName: Yup.string().required(t('EnterNewRole')),
        }),
        onSubmit: async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
            rolesApi.addRole(values.roleName)
                .then(() => {
                    setCreateSuccessMessage(t('CreatedSuccessfully'));
                    setCreateErrorMessage(null);
                    dispatch(fetchAllRoles());
                    resetForm();
                })
                .catch(() => {
                    setCreateErrorMessage(t('RoleExistNotification'));
                    setCreateSuccessMessage(null);
                });
        },
    });

    const handleRoleSelection = (roleId: number) => {
        setSelectedRoleId(roleId);
        setDeleteSuccessMessage(null);
        setDeleteErrorMessage(null);
    };

    const handleRoleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(event);
        setCreateSuccessMessage(null);
        setCreateErrorMessage(null);
    };

    return {
        allRoles,
        selectedRoleId,
        deleteSuccessMessage,
        deleteErrorMessage,
        createSuccessMessage,
        createErrorMessage,
        handleDelete,
        formik,
        handleRoleSelection,
        handleRoleNameChange,
    };
};