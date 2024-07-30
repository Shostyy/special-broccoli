import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginFormValues } from '../types/LoginTypes';
import styles from '../styles/Login.module.css';
import {
    FormikPasswordFieldWithVisibilityToggle,
    GeneralButton,
} from '../../../../components/common';

interface LoginFormProps {
    validationSchema: any;
    onSubmit: (values: LoginFormValues) => Promise<void>;
    onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    validationSchema,
    onSubmit,
    onForgotPassword,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            {t('Login')}
                        </label>
                        <Field
                            type="text"
                            id="username"
                            name="username"
                            placeholder={t('Login')}
                            className={styles.input}
                        />
                        <ErrorMessage
                            name="username"
                            component="div"
                            className={styles.errorMessage}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t('Password')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="password"
                            placeholderTranslationKey="Password"
                            underlined={true}
                        />
                    </div>

                    <div className={styles.buttonContainer}>
                        <GeneralButton
                            type='submit'
                            translationKey='Enter'
                            variant='filled'
                            size='full'
                            disabled={isSubmitting || !isValid}
                        />
                    </div>

                    <div className={styles.forgotPasswordContainer}>
                        <button
                            className={styles.forgotPasswordButton}
                            onClick={onForgotPassword}
                            type="button"
                        >
                            {t('Forgotpassword')}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};