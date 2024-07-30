import { UnauthorizedRoutes } from '../../auth/UnauthorizedRoutes';
import styles from './styles/styles.module.css';
import logo from '../../../assets/images/logo.svg';
import ErrorSuccessMessage from '../../common/ErrorSuccessMessage/ErrorSuccessMessage';
import { useAppSelector } from '../../../types/hooks';
import { LanguageSelector } from '../../common';
import Slider from './components/Slider';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UnauthorizedView: React.FC = () => {
    const {
        errorMessage,
        errorMessageTitle,
        successMessage,
        successMessageTitle,
        additionalInfo,
    } = useAppSelector(state => state.unauthorizedView);

    const location = useLocation();
    const { t } = useTranslation();

    const getCurrentLocationTranslationKey = () => {
        if (location.pathname.startsWith('/login')) {
            return 'Authorization';
        } else if (location.pathname.startsWith('/reset-password')) {
            return 'ResetPasswordPage';
        } else if (location.pathname.startsWith('/complete-registration')) {
            return 'CompleteRegistration';
        }
        return 'Authorization';
    };

    const currentLocationTranslationKey = getCurrentLocationTranslationKey();

    return (
        <div className={styles.mainContainer}>
            <Slider />
            <div className={styles.authContainer}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.title}>
                        {t(currentLocationTranslationKey)}
                    </h2>
                    <div className={styles.languageSelector}>
                        <LanguageSelector />
                    </div>
                </div>
                <div className={styles.authMessages}>
                    {errorMessage && errorMessageTitle && (
                        <ErrorSuccessMessage
                            titleTranslationKey={errorMessageTitle}
                            messageTranslationKey={errorMessage}
                            type={'error'}
                            additionalInfo={additionalInfo}
                        />
                    )}
                    {successMessage && successMessageTitle && (
                        <ErrorSuccessMessage
                            titleTranslationKey={successMessageTitle}
                            messageTranslationKey={successMessage}
                            type={'success'}
                        />
                    )}
                </div>
                <div className={styles.authContent}>
                    <UnauthorizedRoutes />
                </div>
            </div>
        </div>
    );
}

export default UnauthorizedView;