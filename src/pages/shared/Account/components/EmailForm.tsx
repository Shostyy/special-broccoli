import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Account.module.css';
import { EmailFormValues } from '../types/AccountTypes';
import { GeneralButton } from '../../../../components/common';

interface EmailFormProps {
    initialEmail: string | undefined;
    validationSchema: any;
    onSubmit: (values: EmailFormValues) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({
    initialEmail,
    validationSchema,
    onSubmit,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{ email: initialEmail }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, isValid }) => (
                <Form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>{t('Email')}</label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder={t('Email')}
                            className={styles.input}
                        />
                        <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                    </div>
                    <GeneralButton
                        type='submit'
                        translationKey='SaveMail'
                        variant='filled'
                        size='full'
                        disabled={isSubmitting || !isValid}
                    />
                </Form>
            )}
        </Formik>
    );
};