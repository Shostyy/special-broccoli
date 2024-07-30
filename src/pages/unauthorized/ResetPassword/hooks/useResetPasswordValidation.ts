import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useResetPasswordValidation = () => {
    const { t } = useTranslation();

    return Yup.object({
        password: Yup.string()
            .required(t('PasswordIsRequired')),
        passwordConfirmation: Yup.string()
            .required(t('ConfirmPasswordRequired'))
            .test('passwords-match', t('PwsDNM'), function(value) {
                return this.parent.password === value;
            }),
    });
};