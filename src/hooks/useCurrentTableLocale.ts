import { useMemo } from 'react';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { useTranslation } from 'react-i18next';

export const useCurrentTableLocale = () => {
    const { i18n } = useTranslation();

    return useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n.language]);
};
