import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

export const useCompleteRegistrationValidation = () => {
  const { t } = useTranslation();

  return Yup.object().shape({
    temporaryPassword: Yup.string().required(t('TempPasswordIsRequired')),
    newPassword: Yup.string().required(t('NewPasswordIsRequired')),
    confirmPassword: Yup.string()
      .required(t('NewPasswordIsRequired'))
      .oneOf([Yup.ref('newPassword')], t('ChangePwError')),
  });
};