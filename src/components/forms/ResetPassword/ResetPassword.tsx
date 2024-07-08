import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useResetPasswordValidation from './useResetPasswordValidation';
import { Formik, Form } from 'formik';
import { FormikPasswordFieldWithVisibilityToggle } from '../../common';
import unauthorizedApi from '../../../api/methods/unauthorizedApi';
import { useAppDispatch } from '../../../types/hooks';
import { resetState, setErrorMessage, setSuccessMessage } from '../../../redux/slices/unauthorizedViewSlice';

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const { t } = useTranslation();
    const validationSchema = useResetPasswordValidation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = (newPassword: string) => {
        if (token) {
            const newPasswordData = {
                "token": token,
                "password": newPassword
            }

            dispatch(resetState());

            unauthorizedApi.resetPassword(newPasswordData)
                .then(() => {
                    const messages = {
                        title: 'UpdAuthDataTitle',
                        message: 'PwSuccessResetMessage'
                    }

                    dispatch(setSuccessMessage(messages));
                })
                .catch((error) => {
                    let messages = {
                        title: 'GeneralError',
                        message: 'PwUpdateError',
                    };

                    if (error.status === 400) {
                        messages.message = 'ExpiredTokenMessage';
                    }

                    dispatch(setErrorMessage(messages));
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(resetState());
                        navigate('/login');
                    }, 4000)
                });
        }
    }

    return (<>
        <Formik
            initialValues={{ password: '', passwordConfirmation: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values.password)}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form style={{ width: '400px' }}>
                    <div className="p-8">
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('EnterNewPw')}</label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName='password'
                                placeholderTranslationKey='EnterNewPw'
                                underlined={true}
                            />
                        </div>
                        <div className="mb-12">
                            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">{t('ReTypePw')}</label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName='passwordConfirmation'
                                placeholderTranslationKey='ReTypePw'
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
                                {t("Send")}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    </>
    );
}

export default ResetPassword;
