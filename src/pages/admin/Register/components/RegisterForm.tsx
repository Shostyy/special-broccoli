import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterForm } from '../hooks/useRegisterForm';
import styles from '../styles/Register.module.css';
import { Role } from '../../../../api/types/role';
import CircularProgress from '@mui/material/CircularProgress';

interface RegisterFormProps {
    allRoles: Role[];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ allRoles }) => {
    const { t } = useTranslation();
    const {
        formik,
        isSubmitting,
        successMessage,
        errorMessage,
    } = useRegisterForm(allRoles);

    return (
        <form onSubmit={formik.handleSubmit}>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <div className={styles.inputWrapper}>
                <label htmlFor="login" className={styles.label}>{t('Login')}</label>
                <input
                    id="login"
                    name="login"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.login}
                    className={`${styles.input} ${formik.touched.login && formik.errors.login ? styles.inputError : ''}`}
                />
                {formik.touched.login && formik.errors.login && (
                    <div className={styles.errorText}>{formik.errors.login}</div>
                )}
            </div>

            <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.label}>{t('Email')}</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.inputError : ''}`}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className={styles.errorText}>{formik.errors.email}</div>
                )}
            </div>

            <div className={styles.inputWrapper}>
                <label htmlFor="role" className={styles.label}>{t('Role')}</label>
                <select
                    id="role"
                    name="role"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    className={`${styles.input} ${formik.touched.role && formik.errors.role ? styles.inputError : ''}`}
                >
                    <option key={'selectRole'} value="" disabled hidden>{t('Role')}</option>
                    {allRoles.map(role => (
                        <option key={role.id} value={role.name}>{t(role.name)}</option>
                    ))}
                </select>
                {formik.touched.role && formik.errors.role && (
                    <div className={styles.errorText}>{formik.errors.role}</div>
                )}
            </div>

            <div>
                <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
                    {isSubmitting ? (
                        <CircularProgress size={24} className={styles.spinner} />
                    ) : t('Register')}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;