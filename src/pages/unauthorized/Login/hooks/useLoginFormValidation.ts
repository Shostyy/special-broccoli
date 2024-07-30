import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const useLoginFormValidation = () => {
    const { t } = useTranslation();

    return Yup.object().shape({
        username: Yup.string().required(t('UsernameIsRequired')),
        password: Yup.string().required(t('PasswordIsRequired')),
    });
};

export default useLoginFormValidation;
