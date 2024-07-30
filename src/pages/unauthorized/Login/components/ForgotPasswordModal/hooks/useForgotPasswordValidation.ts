import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useForgotPasswordValidation = () => {
    const { t } = useTranslation();

    return yup.object({
        email: yup
            .string()
            .email(t('InvalidEmail'))
            .required(t('EmailValidation')),
    });
};