import i18n from './i18n';
import CookieHandler from './utils/cookieHandler';

export const initializeApp = async () => {
    const language = CookieHandler.getCookie('language');

    if (language) {
        await i18n.changeLanguage(language);
    }
}
