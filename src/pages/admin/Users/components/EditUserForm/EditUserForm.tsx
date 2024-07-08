import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { fetchUsersAsync, setSelectedUser } from '../../../../../redux/slices/usersSlice';
import { ConfirmationModal } from '../ConfirmationModal';
import { fetchUsersRelationshipAsync } from '../../../../../redux/slices/usersRelationshipSlice';
import { handleSetMessageTemporarily } from '../../../../../utils/handleSetMessageTemporarily';
import editUserApi from '../../../../../api/methods/editUserApi';

const EditUserForm: React.FC = () => {
    const selectedUser = useAppSelector(state => state.users.selectedUsed);
    const allRoles = useAppSelector(state => state.register.allRoles);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleUnselectUser = () => {
        dispatch(setSelectedUser(null));
    }

    const handleDeleteUser = () => {
        if (selectedUser?.id) {
            editUserApi.deleteUser(selectedUser.id)
                .then(() => {
                    dispatch(fetchUsersAsync());
                    handleUnselectUser();
                    handleSetMessageTemporarily('UserDelSuccess', setSuccessMessage, timerIdRef, t);
                    dispatch(fetchUsersRelationshipAsync());
                })
                .catch(() => {
                    handleSetMessageTemporarily('UserDetailUpdError', setErrorMessage, timerIdRef, t);
                })
                .finally(() => setIsModalOpen(false))
        }
    }

    const handleToggleUserBlock = () => {
        if (selectedUser?.id) {
            editUserApi.toggleUserBlock(selectedUser)
                .then(() => {
                    dispatch(fetchUsersAsync());
                    handleUnselectUser();
                    handleSetMessageTemporarily('UserDetailUpdSuccess', setSuccessMessage, timerIdRef, t);
                    setIsModalOpen(false);
                })
                .catch(() => {
                    handleSetMessageTemporarily('UserDetailUpdError', setErrorMessage, timerIdRef, t);
                })
        }
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const validationSchema = Yup.object({
        login: Yup.string().required(t('LoginIsRequired')),
        email: Yup.string().email(t('InvalidEmail')).required(t('EmailIsRequired')),
        role: Yup.string().required(t('RoleIsRequired')),
    });

    const formik = useFormik({
        initialValues: {
            login: selectedUser?.login || '',
            email: selectedUser?.email || '',
            role: selectedUser?.role.name || '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const roleId = allRoles?.find(role => role.name === values.role)?.id || 0;
            if (selectedUser?.id && roleId) {
                const requestData = {
                    id: selectedUser?.id || 0,
                    login: values.login,
                    email: values.email,
                    role: {
                        id: roleId,
                        name: values.role,
                    },
                    isBlocked: selectedUser?.blocked || false,
                };


                editUserApi.editUser(requestData)
                    .then(() => {
                        handleSetMessageTemporarily('UserDetailUpdSuccess', setSuccessMessage, timerIdRef, t);
                        dispatch(fetchUsersAsync());
                        handleUnselectUser();
                    })
                    .catch(() => {
                        setErrorMessage(t('UserDetailUpdError'));
                    })
            }
        },
    });

    useEffect(() => {
        formik.setValues({
            login: selectedUser?.login || '',
            email: selectedUser?.email || '',
            role: selectedUser?.role.name || '',
        });
    }, [selectedUser]);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                        {t('Login')}
                    </label>
                    <input
                        id="login"
                        name="login"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.login}
                        disabled={!selectedUser}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {selectedUser && formik.touched.login && formik.errors.login ? (
                        <div className="text-red-500 text-sm">{formik.errors.login.toString()}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('Email')}
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        disabled={!selectedUser}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {selectedUser && formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-sm">{formik.errors.email.toString()}</div>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        {t('Role')}
                    </label>
                    <select
                        id="role"
                        name="role"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.role}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        disabled={!selectedUser}
                    >
                        <option value="" disabled hidden>{t('Role')}</option>
                        {allRoles?.map((role) => (
                            <option key={role.name} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {selectedUser && formik.touched.role && formik.errors.role ? (
                        <div className="text-red-500 text-sm">{formik.errors.role.toString()}</div>
                    ) : null}
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className={`bg-red-500 text-white p-2 rounded-md ${!selectedUser ? 'filter grayscale' : ''}`}
                        disabled={!selectedUser}
                    >
                        {t('Save')}
                    </button>

                    <button
                        type="button"
                        className={`bg-red-500 text-white p-2 rounded-md ${!selectedUser ? 'filter grayscale' : ''}`}
                        onClick={handleUnselectUser}
                        disabled={!selectedUser}
                    >
                        {t('Cancel')}
                    </button>

                    <button
                        type="button"
                        className={`bg-red-500 text-white p-2 rounded-md ${!selectedUser ? 'filter grayscale' : ''}`}
                        onClick={handleToggleUserBlock}
                        disabled={!selectedUser}
                    >
                        {selectedUser?.blocked ? t('Unblock') : t('Block')}
                    </button>

                    <button
                        type="button"
                        className={`bg-red-800 text-white p-2 rounded-md ${!selectedUser ? 'filter grayscale' : ''}`}
                        onClick={handleOpenModal}
                        disabled={!selectedUser}
                    >
                        {t('Delete')}
                    </button>
                </div>
                {!!successMessage && (
                    <div className="bg-green-200 text-green-700 p-4 mt-4 shadow-md rounded">
                        {successMessage}
                    </div>
                )}
                {!!errorMessage && (
                    <div className="bg-red-200 text-red-700 p-4 mt-4 shadow-md rounded">
                        {errorMessage}
                    </div>
                )}
            </form>
            {isModalOpen && (
                <ConfirmationModal
                    message='RelationshipDelMessage'
                    onConfirm={handleDeleteUser}
                    onCancel={handleCloseModal}
                />
            )}
        </>
    );
}

export default EditUserForm;