import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useAccountValidation = () => {
  const { t } = useTranslation();

  const emailValidationSchema = yup.object({
    email: yup.string().email(t('InvalidEmail')).required(t('EmailValidation')),
  });

  const passwordValidationSchema = yup.object({
    currentPassword: yup.string().required(t('TypePw')),
    newPassword: yup.string().required(t('EnterNewPw')),
    confirmNewPassword: yup.string()
      .oneOf([yup.ref('newPassword')], t('PwsDNM'))
      .required(t('EnterNewPw')),
  });

  return { emailValidationSchema, passwordValidationSchema };
};