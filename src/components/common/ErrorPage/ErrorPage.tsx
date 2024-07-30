import React from 'react';
import styles from './styles/ErrorPage.module.css';
import { useAppSelector } from '../../../types/hooks';
import GeneralButton from '../Buttons/GeneralButton/GeneralButton';
import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import { appIcons } from '../../../data/constants/icons';

const ErrorPage: React.FC = () => {
  const { errorKey } = useAppSelector((state) => state.appError);
  const { t } = useTranslation();

  if (!errorKey) {
    return null;
  }

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>{t('SomethingWentWrong')}</h1>
      <p className={styles.message}>{t(errorKey)}</p>
      <GeneralButton
        onClick={() => window.location.reload()}
        translationKey='ReloadPage'
        icon={appIcons.reloadRed}
      />
    </div>
  );
};

export default ErrorPage;