import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchAllRoles } from '../../../redux/slices/registerNewUserSlice';
import { Box, CircularProgress } from '@mui/material';
import registerApi from '../../../api/methods/registerApi';
import styles from './styles/styles.module.css';

const Register: React.FC = () => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const allRoles = useAppSelector(state => state.register.allRoles);
    const isLoading = useAppSelector(state => state.register.loading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllRoles());
    }, [dispatch]);

    //TODO if status code is 200 but body has payload false mean some error happened, need to show it with key UserRegError

    const formik = useFormik({
        initialValues: {
            login: '',
            email: '',
            role: '' // Default value for role is now empty
        },
        validationSchema: Yup.object({
            login: Yup.string()
                .required(t('UsernameIsRequired')),
            email: Yup.string()
                .email(t('InvalidEmail'))
                .required(t('EmailIsRequired')),
            role: Yup.string()
                .required(t('RoleIsRequired')) // Add validation for role
        }),
        onSubmit: (values) => {
            const role = allRoles?.find(role => role.name === values.role);
            if (!role) {
                console.error('Role not found');
                return;
            }

            const transformedValues = {
                login: values.login,
                email: values.email,
                role: {
                    id: role.id,
                    name: role.name
                }
            }

            setIsSubmitting(true);
            setSuccessMessage(null);
            setErrorMessage(null);

            registerApi.register(transformedValues)
                .then(() => {
                    setSuccessMessage(t('UserRegSuccess'));
                    formik.resetForm();
                })
                .catch((err: any) => {
                    if (err.status === 401) {
                        window.location.reload();
                    }

                    if (err.data === 'UserExistByEmail' || err.data === 'UserExistByLogin' || err.data === 'UserRegError') {
                        setErrorMessage(t(err.data));
                    }
                    

                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!allRoles || isLoading) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.contentWrapper}>
                <form onSubmit={formik.handleSubmit}>
                    {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}
                    {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

                    <div className={styles.inputWrapper}>
                        <label htmlFor="login" className="block text-gray-700">{t('Login')}</label>
                        <input
                            id="login"
                            name="login"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.login}
                            className={`mt-1 block w-full p-2 border ${formik.touched.login && formik.errors.login ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        {formik.touched.login && formik.errors.login ? (
                            <div className="text-red-500 text-sm">{formik.errors.login}</div>
                        ) : null}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="email" className="block text-gray-700">{t('Email')}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`mt-1 block w-full p-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="role" className="block text-gray-700">{t('Role')}</label>
                        <select
                            id="role"
                            name="role"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.role}
                            className={`mt-1 block w-full p-2 border ${formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded`}
                        >
                            <option key={'selectRole'} value="" disabled hidden>{t('Role')}</option>
                            {allRoles && allRoles.length > 0 && allRoles.map(role => (
                                <option key={role.id} value={role.name}>{t(role.name)}</option>
                            ))}
                        </select>
                        {formik.touched.role && formik.errors.role ? (
                            <div className="text-red-500 text-sm">{formik.errors.role}</div>
                        ) : null}
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
                            {isSubmitting ? <CircularProgress /> : t('Register')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
