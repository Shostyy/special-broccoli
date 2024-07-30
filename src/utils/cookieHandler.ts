import { MS_IN_DAY } from '../data/constants/constants';

const COOKIE_START_INDEX = 0;
const START_SUB_STRING_INDEX = 1;

const CookieHandler = {
  setCookie: (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * MS_IN_DAY));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  },

  getCookie: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(COOKIE_START_INDEX) === ' ') {
        cookie = cookie.substring(START_SUB_STRING_INDEX, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === COOKIE_START_INDEX) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },

  deleteCookie: (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  },
};

export default CookieHandler;
