import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchUserInfoAsync, loginAsync } from '../../../redux/slices/loginSlice';
import { useAppDispatch } from '../../../types/hooks';
import useLoginFormValidation from './useLoginFormValidation';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal';
import { useNavigate } from 'react-router-dom';
import { FormikPasswordFieldWithVisibilityToggle } from '../../common';
import { LanguageSelector } from '../../common';
import loginApi from '../../../api/methods/loginApi';

const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const validationSchema = useLoginFormValidation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const togglePopupVisibility = () => {
        setIsPopupVisible(!isPopupVisible);
    }

    return (
        <>
            <LanguageSelector />
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        await loginApi.login(values);
                        dispatch(fetchUserInfoAsync());
                    } catch (error: any) {
                        if (error.status === 401) {
                            setErrorMessage(t('IncorrectUserNameOrPassword'));
                        }
                    }
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <div className="bg-gray-200 min-h-screen flex flex-col justify-center items-center">
                        <Form className="bg-white rounded-lg shadow-md" style={{ width: '400px' }}>
                            <div className="bg-red-600 text-white text-center h-28 w-full rounded-t-lg">
                                <h2 className="flex justify-center items-center h-full text-2xl">{t("ClientOffice")}</h2>
                            </div>
                            <div className="p-8">
                                <div className="mb-6">
                                    {errorMessage && (
                                        <span>{errorMessage}</span>
                                    )}
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t("Login")}</label>
                                    <Field type="text" id="username" name="username" placeholder={t("Login")} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base" />
                                    <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("Password")}</label>
                                    <FormikPasswordFieldWithVisibilityToggle
                                        idAndName='password'
                                        placeholderTranslationKey='Password'
                                    />
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    {t("Enter")}
                                </button>

                                <div className="flex justify-center items-center h-10">
                                    <button
                                        className="text-red-500 hover:underline text-center font-semibold"
                                        onClick={togglePopupVisibility}
                                        type="button"
                                    >
                                        {t('Forgotpassword')}
                                    </button>
                                </div>
                            </div>
                        </Form>
                        <ForgotPasswordModal
                            isPopupVisible={isPopupVisible}
                            onClose={togglePopupVisibility}
                        />
                    </div>
                )}
            </Formik>
        </>
    );
}

export default LoginForm;
