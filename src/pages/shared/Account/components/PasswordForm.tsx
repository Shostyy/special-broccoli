import React from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Account.module.css';
import { PasswordFormValues } from '../types/AccountTypes';
import { FormikPasswordFieldWithVisibilityToggle, GeneralButton } from '../../../../components/common';

interface PasswordFormProps {
    validationSchema: any;
    onSubmit: (values: PasswordFormValues) => void;
    passwordChangeError: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
    validationSchema,
    onSubmit,
    passwordChangeError,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                onSubmit(values);
                setSubmitting(false);
                resetForm();
            }}
        >
            {({ isSubmitting, isValid }) => (
                <Form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="currentPassword" className={styles.label}>
                            {t('EnterCurPw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="currentPassword"
                            placeholderTranslationKey="EnterCurPw"
                        />
                        {passwordChangeError && (
                            <div className={styles.errorMessage}>{t('ChangePwError')}</div>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                            {t('EnterNwPw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="newPassword"
                            placeholderTranslationKey="EnterNwPw"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmNewPassword" className={styles.label}>
                            {t('ReTypePw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="confirmNewPassword"
                            placeholderTranslationKey="ReTypePw"
                        />
                    </div>

                    <GeneralButton
                        type='submit'
                        translationKey='ChangePw'
                        variant='filled'
                        size='full'
                        disabled={isSubmitting || !isValid}
                    />
                </Form>
            )}
        </Formik>
    );
};