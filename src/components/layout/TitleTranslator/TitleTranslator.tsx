import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { titleTranslationDictionary } from '../../../data/constants/titleTranslationDictionary';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

const TitleTranslator: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (location && location.pathname) {
      const normalizedPath = location.pathname.toLowerCase().trim().replace('/', '');
      const translation = titleTranslationDictionary[normalizedPath];
      document.title = t(translation) || t('ClientOffice');
    } else {
      document.title = t('ClientOffice');
    }
  }, [location, t]);

  return (
    <div>
      {children}
    </div>
  );
};

export default TitleTranslator;
