import React from 'react';
import styles from './styles/ErrorSuccessText.module.css';

interface ErrorSuccessTextProps {
    type: 'error' | 'success';
    message: string;
}

const ErrorSuccessText: React.FC<ErrorSuccessTextProps> = ({ type, message }) => {
    return (
        <>
            {type === 'success' && <p className={styles.success}>{message}</p>}
            {type === 'error' && <p className={styles.error}>{message}</p>}
        </>
    );
}

export default ErrorSuccessText;
