import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles/ForgotPasswordModal.module.css';
import {
    ForgotPasswordFormValues,
    ForgotPasswordModalProps,
} from './types/ForgotPasswordTypes';
import { useAppDispatch } from '../../../../../types/hooks';
import {
    useForgotPasswordValidation,
} from './hooks/useForgotPasswordValidation';
import { handleForgotPasswordSubmit } from './utils/ForgotPasswordUtils';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isPopupVisible,
    onClose,
}) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const validationSchema = useForgotPasswordValidation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current
                && !modalRef.current.contains(event.target as Node)
            ) {
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

    const handleSubmit = async (values: ForgotPasswordFormValues) => {
        await handleForgotPasswordSubmit(values.email, dispatch, onClose);
    };

    if (!isPopupVisible) return null;

    return (
        <div className={styles.overlay}>
            <div ref={modalRef} className={styles.modal}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    type="button"
                >
                    <CloseIcon />
                </button>
                <h2 className={styles.title}>{t('EnterYourEmail')}</h2>
                <ForgotPasswordForm
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordModal;