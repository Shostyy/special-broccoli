import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ForgotPasswordFormValues } from '../types/ForgotPasswordTypes';
import styles from '../styles/ForgotPasswordModal.module.css';
import { GeneralButton } from '../../../../../../components/common';

interface ForgotPasswordFormProps {
    validationSchema: any;
    onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    validationSchema,
    onSubmit,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form className={styles.form}>
                <label htmlFor="email" className={styles.srOnly}>
                    {t('EnterYourEmail')}
                </label>
                <Field
                    type="email"
                    id="email"
                    name="email"
                    className={styles.input}
                    placeholder={t('Email')}
                    formNoValidate
                />
                <GeneralButton
                    type='submit'
                    translationKey='Send'
                    variant='filled'
                />
                <ErrorMessage
                    name="email"
                    component="div"
                    className={styles.errorMessage}
                />
            </Form>
        </Formik>
    );
};