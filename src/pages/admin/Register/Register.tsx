import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterForm from './components/RegisterForm';
import styles from './styles/Register.module.css';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchAllRoles } from '../../../redux/slices/registerNewUserSlice';

const Register: React.FC = () => {
    const { t } = useTranslation();
    const { allRoles, loading } = useAppSelector(state => state.register);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllRoles());
    }, [dispatch]);

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <CircularProgress color='error' />
            </div>
        );
    }

    if (!allRoles) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.contentWrapper}>
                <RegisterForm allRoles={allRoles} />
            </div>
        </div>
    );
};

export default Register;