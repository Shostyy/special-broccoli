import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FormikPasswordFieldWithVisibilityToggle } from '../../../components/common';
import { CompleteRegistrationData } from '../../../api/postTypes/completeRegistrationData';
import unauthorizedApi from '../../../api/methods/unauthorizedApi';
import { resetState, setErrorMessage, setSuccessMessage } from '../../../redux/slices/unauthorizedViewSlice';
import { useAppDispatch } from '../../../types/hooks';

const CompleteRegistration: React.FC = () => {
    const { userId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const validationSchema = Yup.object().shape({
        temporaryPassword: Yup.string().required(t('TempPasswordIsRequired')),
        newPassword: Yup.string()
            .required(t('NewPasswordIsRequired')),
        confirmPassword: Yup.string()
            .required(t('NewPasswordIsRequired'))
            .oneOf([Yup.ref('newPassword')], t('ChangePwError'))
    });

    return (
        <Formik
            initialValues={{ temporaryPassword: '', newPassword: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                if (userId) {
                    const newPasswordData: CompleteRegistrationData = {
                        "id": userId,
                        "temporaryPassword": values.temporaryPassword,
                        "newPassword": values.newPassword,
                    };

                    dispatch(resetState());

                    unauthorizedApi.completeRegistration(newPasswordData)
                        .then(() => {
                            const messages = {
                                title: 'UpdAuthDataTitle',
                                message: 'PwNotification'
                            }

                            dispatch(setSuccessMessage(messages));
                        })
                        .catch(() => {
                            let messages = {
                                title: 'UpdAuthDataTitle',
                                message: 'PwUpdateError',
                            };

                            dispatch(setErrorMessage(messages));
                        })
                        .finally(() => {

                            setTimeout(() => {
                                dispatch(resetState());
                                navigate('/login');
                            }, 6000)


                        })

                    resetForm();
                }
            }}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form style={{ width: '400px' }}>
                    <div>
                        <div className="mb-6">
                            <label htmlFor="temporaryPassword" className="font- block text-lg font-medium text-gray-700">{t('EnterTempPw')}</label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName='temporaryPassword'
                                placeholderTranslationKey='EnterTempPw'
                                underlined={true}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700">{t('EnterNewPw')}</label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName='newPassword'
                                placeholderTranslationKey='EnterNewPw'
                                underlined={true}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">{t('ReTypePw')}</label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName='confirmPassword'
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
                                {t('UpdatePw')}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default CompleteRegistration;
