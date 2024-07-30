import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CookieHandler from '../../../utils/cookieHandler';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface LanguageSelectorProps {
  widthFull?: boolean;
  onSelect?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ widthFull, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
      .then(() => {
        CookieHandler.setCookie('language', language, 365 * 2);
      });
  }

  const handleChangeAndClose = (language: string) => {
    changeLanguage(language);
    setIsOpen(false);
    if (onSelect) {
      onSelect();
    }
  }

  const currentLanguage = i18n.language;

  const languageDisplay: { [key: string]: string } = {
    uk: 'UA',
    en: 'EN',
  };

  return (
    <div className={`relative z-40 ${widthFull ? 'w-full' : 'w-20'}`}>
      <button
        onClick={toggleDropdown}
        id="language-selector"
        className={`flex items-center gap-1 justify-center h-10 text-sm font-medium text-[#C25458] bg-white border border-[#C25458] hover:bg-[#F8E7E7] transition-colors duration-300 rounded ${widthFull ? 'w-full' : 'w-20'}`}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        {languageDisplay[currentLanguage] || currentLanguage.toUpperCase()}<SwapHorizIcon />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 bottom-full mb-2 shadow-lg rounded overflow-hidden ${widthFull ? 'w-full' : 'w-20'}`}
          aria-labelledby="language-selector"
        >
          <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.entries(languageDisplay).map(([code, display]) => (
              <button
                key={code}
                onClick={() => handleChangeAndClose(code)}
                className={`block w-full py-2 text-sm font-medium transition-colors duration-300 ${
                  currentLanguage === code
                    ? 'text-[#C25458] bg-white border border-[#C25458] hover:bg-[#F8E7E7]'
                    : 'text-white bg-[#C25458] hover:bg-[#B04A4E]'
                }`}
                role="menuitem"
              >
                {display}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;