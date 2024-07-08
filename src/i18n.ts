import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import translationUK from './locales/uk/uk.json';
import translationEN from './locales/en/en.json';

const resources = {
  uk: {
    translation: translationUK,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uk', // default language
    fallbackLng: 'uk', // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
