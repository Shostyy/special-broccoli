import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Role } from '../../../../api/types/role';
import { fetchAllRoles } from '../../../../redux/slices/registerNewUserSlice';
import { useAppDispatch } from '../../../../types/hooks';
import { RegisterFormValues } from '../types/register.types';
import { transformValues } from '../utils/registerUtils';
import registerApi from '../../../../api/methods/registerApi';
import { UNAUTHORIZED_STATUS_CODE } from '../../../../data/constants/constants';

export const useRegisterForm = (allRoles: Role[]) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            login: '',
            email: '',
            role: '',
        },
        validationSchema: Yup.object({
            login: Yup.string().required(t('UsernameIsRequired')),
            email: Yup.string().email(t('InvalidEmail')).required(t('EmailIsRequired')),
            role: Yup.string().required(t('RoleIsRequired')),
        }),
        onSubmit: (values) => {
            setIsSubmitting(true);
            setSuccessMessage(null);
            setErrorMessage(null);

            const transformedValues = transformValues(values, allRoles);

            registerApi.register(transformedValues)
                .then(() => {
                    setSuccessMessage(t('UserRegSuccess'));
                    formik.resetForm();
                })
                .catch((err: any) => {
                    if (err.status === UNAUTHORIZED_STATUS_CODE) {
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

    return { formik, isSubmitting, successMessage, errorMessage };
};