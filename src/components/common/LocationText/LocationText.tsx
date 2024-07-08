import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { titleTranslationDictionary } from '../../../data/constants/titleTranslationDictionary';

const LocationText: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [translatedText, setTranslatedText] = useState('');
  //const [locationIcon, setLocationIcon] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (location && location.pathname) {
      const normalizedPath = location.pathname.toLowerCase().trim().replace('/', '');
      const translation = titleTranslationDictionary[normalizedPath];
      //const image = titleImageDictionary[normalizedPath]; TODO fix image, currently gray should be red
      //console.log(image);
      //setLocationIcon(image);
      setTranslatedText(t(translation));
    } else {
      document.title = 'Client Office';
    }
  }, [location, t]);

  return (
    <span>
      {/*false && locationIcon && <img src={locationIcon} alt={translatedText} />*/}
      {translatedText}
    </span>
  );
};

export default LocationText;
