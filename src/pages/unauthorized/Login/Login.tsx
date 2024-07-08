import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchUserInfoAsync } from '../../../redux/slices/loginSlice';
import { useAppDispatch } from '../../../types/hooks';
import loginApi from '../../../api/methods/loginApi';
import { ForgotPasswordModal } from '../../../components/forms/ForgotPasswordModal';
import { FormikPasswordFieldWithVisibilityToggle, GeneralButton } from '../../../components/common';
import useLoginFormValidation from '../../../components/forms/LoginForm/useLoginFormValidation';
import { resetState, setErrorMessage } from '../../../redux/slices/unauthorizedViewSlice';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const validationSchema = useLoginFormValidation();

    const togglePopupVisibility = () => {
        setIsPopupVisible(!isPopupVisible);
    }

    return (
        <>
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
                            dispatch(resetState());
                            const messages = {
                                title: 'IncorrectUserNameOrPasswordTitle',
                                message: 'IncorrectUserNameOrPassword'
                            }
                            dispatch(setErrorMessage(messages));
                        }
                    }
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <>
                        <Form style={{ width: '400px' }}>
                            <div>
                                <div className="mb-6">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t("Login")}</label>
                                    <Field type="text" id="username" name="username" placeholder={t("Login")} className="mt-1 block w-full px-4 py-3 bg-transparent focus:outline-none focus:border-black sm:text-base border-b-2 border-gray-500" />
                                    <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className="mb-12">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("Password")}</label>
                                    <FormikPasswordFieldWithVisibilityToggle
                                        idAndName='password'
                                        placeholderTranslationKey='Password'
                                        underlined={true}
                                    />
                                </div>

                                <div className='flex w-full items-center justify-center'>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full max-w-[400px] h-12 mb-6 flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-base font-medium text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1585c]"
                                        style={{ backgroundColor: '#c1585c' }}
                                    >
                                        {t("Enter")}
                                    </button>
                                </div>

                                <div className="flex justify-center items-center">
                                    <button
                                        className="text-black underline text-center font-semibold text-base hover:text-red-600"
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
                    </>
                )}
            </Formik>
        </>
    );
}

export default Login;
