import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../types/hooks';
import ErrorSuccessModal from '../../admin/Users/components/ErrorSuccessModal/ErrorSuccessModal';
import styles from './styles/Account.module.css';
import { useAccountValidation } from './hooks/useAccountValidation';
import { changeEmail, changePassword } from './utils/accountUtils';
import { EmailForm } from './components/EmailForm';
import { PasswordForm } from './components/PasswordForm';
import { EmailFormValues, PasswordFormValues } from './types/AccountTypes';

const Account: React.FC = () => {
  const { t } = useTranslation();
  const userData = useAppSelector(state => state.login.userInfo);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [
    passwordChangeError,
    setPasswordChangeError,
  ] = useState<boolean>(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const {
    emailValidationSchema,
    passwordValidationSchema,
  } = useAccountValidation();

  const handleEmailChange = (values: EmailFormValues) => {
    changeEmail(
      values,
      userData,
      setSuccessMessage,
      setErrorMessage,
      timerIdRef,
      t,
    );
  };

  const handlePasswordChange = (values: PasswordFormValues) => {
    changePassword(values,
      userData,
      setSuccessMessage,
      setErrorMessage,
      setPasswordChangeError,
      timerIdRef,
      t,
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('Account')}</h2>
      <div className={styles.formContainer}>
        <EmailForm
          initialEmail={userData?.email}
          validationSchema={emailValidationSchema}
          onSubmit={handleEmailChange}
        />
        <PasswordForm
          validationSchema={passwordValidationSchema}
          onSubmit={handlePasswordChange}
          passwordChangeError={passwordChangeError}
        />
      </div>
      {errorMessage && (
        <ErrorSuccessModal messageType='error' message={errorMessage} />
      )}
      {successMessage && (
        <ErrorSuccessModal messageType='success' message={successMessage} />
      )}
    </div>
  );
};

export default Account;