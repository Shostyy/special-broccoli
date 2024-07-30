import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import styles from '../styles/ResetPassword.module.css';
import {
    FormikPasswordFieldWithVisibilityToggle,
    GeneralButton,
} from '../../../../components/common';

interface ResetPasswordFormProps {
    validationSchema: any;
    onSubmit: (password: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    validationSchema,
    onSubmit,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{ password: '', passwordConfirmation: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values.password)}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className={styles.form}>
                    <div className={styles.formContent}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                {t('EnterNewPw')}
                            </label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName="password"
                                placeholderTranslationKey="EnterNewPw"
                                underlined={true}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label
                                htmlFor="passwordConfirmation"
                                className={styles.label}
                            >
                                {t('ReTypePw')}
                            </label>
                            <FormikPasswordFieldWithVisibilityToggle
                                idAndName="passwordConfirmation"
                                placeholderTranslationKey="ReTypePw"
                                underlined={true}
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <GeneralButton
                                type='submit'
                                translationKey='Send'
                                variant='filled'
                                size='full'
                                disabled={isSubmitting || !isValid || !dirty}
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};