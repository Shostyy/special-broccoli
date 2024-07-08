import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { FormikPasswordFieldWithVisibilityToggle } from '../../../components/common';
import { useAppSelector } from '../../../types/hooks';
import ErrorSuccessModal from '../../admin/Users/components/ErrorSuccessModal/ErrorSuccessModal';
import { handleSetMessageTemporarily } from '../../../utils/handleSetMessageTemporarily';
import userApi from '../../../api/methods/userApi';
import styles from './styles/styles.module.css';

const Account: React.FC = () => {
    const { t } = useTranslation();
    const userData = useAppSelector(state => state.login.userInfo);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [passwordChangeError, setPasswordChangeError] = useState<boolean>(false); // State to track password change error
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    // Yup schema for email validation
    const emailValidationSchema = yup.object({
        email: yup.string().email(t('InvalidEmail')).required(t('EmailValidation')),
    });

    // Yup schema for password validation
    const passwordValidationSchema = yup.object({
        currentPassword: yup.string().required(t('TypePw')),
        newPassword: yup.string().required(t('EnterNewPw')),
        confirmNewPassword: yup.string()
            .oneOf([yup.ref('newPassword')], t('PwsDNM'))
            .required(t('EnterNewPw')),
    });

    const changeEmail = (values: { email: string | undefined }) => {
        if (userData?.id && values.email) {
            const newEmailData = {
                id: userData.id,
                email: values.email
            };

            userApi.changeEmail(newEmailData)
                .then(() => handleSetMessageTemporarily('EmailNotification', setSuccessMessage, timerIdRef, t, 2000))
                .catch(() => handleSetMessageTemporarily('EmailUpdateError', setErrorMessage, timerIdRef, t, 2000));
        }
    }

    const changePassword = (values: { currentPassword: string, newPassword: string }) => {
        if (userData?.id) {
            const newPasswordData = {
                "id": userData?.id,
                "password": values.currentPassword,
                "newPassword": values.newPassword
            }

            userApi.changePassword(newPasswordData)
                .then(() => {
                    handleSetMessageTemporarily('PwNotification', setSuccessMessage, timerIdRef, t, 2000);
                    setPasswordChangeError(false);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        setPasswordChangeError(true);
                    } else {
                        handleSetMessageTemporarily('PwUpdateError', setErrorMessage, timerIdRef, t, 2000);
                    }
                });
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl mb-4">{t('Account')}</h2>
            <div className="space-y-8">
                {/* Email Form */}
                <Formik
                    initialValues={{ email: userData?.email }}
                    validationSchema={emailValidationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        changeEmail(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-gray-500 font-semibold">{t('Email')}</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t('Email')}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-2" />
                            </div>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                            >
                                {t('SaveMail')}
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Password Form */}
                <Formik
                    initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        changePassword(values);
                        setSubmitting(false);
                        resetForm();
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="text-gray-500 font-semibold">{t('EnterCurPw')}</label>
                                <FormikPasswordFieldWithVisibilityToggle
                                    idAndName="currentPassword"
                                    placeholderTranslationKey="EnterCurPw"
                                />
                                {passwordChangeError && <div className="text-red-500 text-sm mt-2">{t('ChangePwError')}</div>} {/* Display password change error */}
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="text-gray-500 font-semibold">{t('EnterNwPw')}</label>
                                <FormikPasswordFieldWithVisibilityToggle
                                    idAndName="newPassword"
                                    placeholderTranslationKey="EnterNwPw"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmNewPassword" className="text-gray-500 font-semibold">{t('ReTypePw')}</label>
                                <FormikPasswordFieldWithVisibilityToggle
                                    idAndName="confirmNewPassword"
                                    placeholderTranslationKey="ReTypePw"
                                />
                            </div>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={isSubmitting}
                            >
                                {t('ChangePw')}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            {errorMessage && (
                <ErrorSuccessModal
                    messageType='error'
                    message={errorMessage}
                />
            )}
            {successMessage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={successMessage}
                />
            )}
        </div>
    );
};

export default Account;