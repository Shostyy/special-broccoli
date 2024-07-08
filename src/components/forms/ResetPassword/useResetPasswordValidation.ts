import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const useResetPasswordValidation = () => {
    const { t } = useTranslation();

    return Yup.object({
        password: Yup.string().required(t('PasswordIsRequired')),
        passwordConfirmation: Yup.string()
           .oneOf([Yup.ref('password')], t('PwsDNM'))
      });
};

export default useResetPasswordValidation;
