import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import styles from '../styles/CompleteRegistration.module.css';
import {
    FormikPasswordFieldWithVisibilityToggle,
    GeneralButton,
} from '../../../../components/common';
import {
    CompleteRegistrationFormValues,

} from '../types/CompleteRegistrationTypes';

interface CompleteRegistrationFormProps {
    validationSchema: any;
    onSubmit: (values: CompleteRegistrationFormValues) => void;
}

// eslint-disable-next-line
export const CompleteRegistrationForm: React.FC<CompleteRegistrationFormProps> = ({
    validationSchema,
    onSubmit,
}) => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={{
                temporaryPassword: '',
                newPassword: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label
                            htmlFor="temporaryPassword"
                            className={styles.label}
                        >
                            {t('EnterTempPw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="temporaryPassword"
                            placeholderTranslationKey="EnterTempPw"
                            underlined={true}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                            {t('EnterNewPw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="newPassword"
                            placeholderTranslationKey="EnterNewPw"
                            underlined={true}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label
                            htmlFor="confirmPassword"
                            className={styles.label}
                        >
                            {t('ReTypePw')}
                        </label>
                        <FormikPasswordFieldWithVisibilityToggle
                            idAndName="confirmPassword"
                            placeholderTranslationKey="ReTypePw"
                            underlined={true}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <GeneralButton
                            type='submit'
                            translationKey='UpdatePw'
                            variant='filled'
                            size='full'
                            disabled={isSubmitting || !isValid}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
};