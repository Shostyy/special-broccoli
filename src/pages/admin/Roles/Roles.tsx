import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchAllRoles } from '../../../redux/slices/registerNewUserSlice';
import rolesApi from '../../../api/methods/rolesApi';
import styles from './styles/Roles.module.css';
import { ADMIN_ROLE, CLIENT_ROLE } from '../../../data/constants/constants';

const Roles: React.FC = () => {
    const dispatch = useAppDispatch();
    const allRoles = useAppSelector(state => state.register.allRoles);
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
                return;
            }
            rolesApi.deleteRole(roleId)
                .then(() => {
                    setDeleteSuccessMessage(t('RoleDelSuccess'));
                    setSelectedRoleId(null);
                    dispatch(fetchAllRoles());
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        setDeleteErrorMessage(t('CannotDeleteRelatedRole'));
                    } else {
                        setDeleteErrorMessage(t('FailedToDeleteRole'));
                        console.error('Delete role error:', error);
                    }
                });
        }
    };

    const formik = useFormik({
        initialValues: {
            roleName: '',
        },
        validationSchema: Yup.object({
            roleName: Yup.string().required(t('EnterNewRole')),
        }),
        onSubmit: async (values, { resetForm }) => {
            rolesApi.addRole(values.roleName)
                .then(() => {
                    setCreateSuccessMessage(t('CreatedSuccessfully'));
                    dispatch(fetchAllRoles());
                    resetForm();
                })
                .catch(() => {
                    setCreateErrorMessage(t('RoleExistNotification'));
                });
        },
    });

    const handleRoleSelection = (roleId: number | null) => {
        setSelectedRoleId(roleId);
        setDeleteSuccessMessage(null);
        setDeleteErrorMessage(null);
    };

    const handleRoleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(event);
        setCreateSuccessMessage(null);
        setCreateErrorMessage(null);
    };

    if (!allRoles || allRoles.length === 0) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.half}>
                <h2 className="text-lg font-bold mb-4">{t('CurrentRs')}</h2>
                <div>
                    {allRoles.map((role) => (
                        <div key={role.id} className="flex items-center mb-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.id}
                                    className="mr-2"
                                    checked={selectedRoleId === role.id}
                                    onChange={() => handleRoleSelection(role.id)}
                                />
                                <span>{t(role.name)}</span>
                            </label>
                        </div>

                    ))}
                </div>
                {(deleteSuccessMessage || deleteErrorMessage) && (
                    <div className="mt-2">
                        {deleteSuccessMessage && <div className="text-green-500">{deleteSuccessMessage}</div>}
                        {deleteErrorMessage && <div className="text-red-500">{deleteErrorMessage}</div>}
                    </div>
                )}
                <button
                    onClick={() => handleDelete(selectedRoleId || 0, allRoles.find(role => role.id === selectedRoleId)?.name || '')}
                    className={styles.saveButton}
                    disabled={!selectedRoleId}
                >
                    {selectedRoleId !== null ? t('Delete') : t('RoleNotification')}
                </button>
            </div>
            <div className={styles.half}>
                <h2 className="text-lg font-bold mb-4">{t('NewRole')}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="roleName" className="block mb-2">{t('EnterNewRole')}</label>
                    <input
                        type="text"
                        id="roleName"
                        name="roleName"
                        className={`border border-gray-400 p-2 w-full mb-2 ${formik.errors.roleName ? 'border-red-500' : ''}`}
                        onChange={handleRoleNameChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.roleName}
                    />
                    {formik.touched.roleName && formik.errors.roleName && (
                        <div className="text-red-500 mb-2">{formik.errors.roleName}</div>
                    )}
                    {createSuccessMessage && <div className="text-green-500">{createSuccessMessage}</div>}
                    {createErrorMessage && <div className="text-red-500">{createErrorMessage}</div>}
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={formik.isSubmitting}
                    >
                        {t('Create')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Roles;
