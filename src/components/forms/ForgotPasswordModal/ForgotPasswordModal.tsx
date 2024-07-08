import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { handleSetMessageTemporarily } from '../../../utils/handleSetMessageTemporarily';
import unauthorizedApi from '../../../api/methods/unauthorizedApi';
import { useAppDispatch } from '../../../types/hooks';
import { resetState, setErrorMessage, setSuccessMessage } from '../../../redux/slices/unauthorizedViewSlice';

interface ForgotPasswordModalProps {
    isPopupVisible: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isPopupVisible, onClose }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useAppDispatch();

    // Yup schema for validation
    const validationSchema = yup.object({
        email: yup.string().email(t('InvalidEmail')).required(t('EmailValidation')),
    });



    // Close modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isPopupVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupVisible, onClose]);

    return (
        <>
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={modalRef} className="relative p-16 pt-6 pb-6 flex flex-col bg-white p-bl rounded shadow-lg w-full max-w-md">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            type="button"
                        >
                            <CloseIcon />
                        </button>
                        <h2 className="text-xl mb-4">{t('EnterYourEmail')}</h2>
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                dispatch(resetState());
                                await unauthorizedApi.resetPasswordInit(values.email)
                                    .then(() => {
                                        const messages = {
                                            title: 'UpdAuthDataTitle',
                                            message: 'CheckYourInbox'
                                        }
                                        dispatch(setSuccessMessage(messages));
                                    })
                                    .catch(() => {
                                        {/*TODO fix message with additional info */}
                                        let messages = {
                                            title: 'GeneralError',
                                            message: 'UserNotRegisteredError',
                                            additionalInfo: values.email,
                                        };
                    
                                        dispatch(setErrorMessage(messages));
                                    })
                                    .finally(() => {
                                        setSubmitting(false);
                                        onClose();
                                    })
                            }}
                        >
                            <Form className="flex items-center justify-center flex-col space-x-2">
                                <label htmlFor="email" className="sr-only">{t('EnterYourEmail')}</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="flex-1 px-4 py-2 border rounded focus:outline-none w-full mb-4"
                                    placeholder={t('Email')}
                                    formNoValidate
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-300"
                                    style={{
                                        backgroundColor: '#C25458',
                                        width: '150px',
                                        height: '40px',
                                    }}
                                >
                                    {t('Send')}
                                </button>
                            </Form>
                        </Formik>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-2" />
                    </div>
                </div>
            )}
        </>
    );
}

export default ForgotPasswordModal;
