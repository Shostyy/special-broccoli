export const BASE_URL = 'https://api.client-office.tsa-dev.pp.ua';

//roles
export const ADMIN_ROLE = 'ADMIN';
export const CLIENT_ROLE = 'CLIENT';

//api message duration
export const BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION = 8000;
export const BOTTOM_RIGHT_ERROR_MESSAGE_DURATION = 15000;

export const OVER_UI_SUCCESS_MESSAGE_DURATION = 1500;
export const OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION = 2500;

export const REDIRECT_TO_LOGIN_DELAY = 4000;

export const SLIDER_CHANGE_FREQUENCY_MS = 30000;

export const MS_IN_DAY = 86400000;

export const UNAUTHORIZED_STATUS_CODE = 401;
export const INCORRECT_CURRENT_PASSWORD_STATUS_CODE = 400;
export const EXPIRED_TOKEN_STATUS_CODE = 400;
export const RESPONSE_STATUS_OK = 200;
export const RESPONSE_STATUS_ERROR = 500;
export const RESPONSE_FAILED_TO_DELETE = 409;

const LAST_HOUR = 23;
const LAST_MINUTE = 23;
const LAST_SECOND = 23;
const LAST_MS = 23;
export const END_OF_DAY: [
    number,
    number,
    number,
    number,
] = [LAST_HOUR, LAST_MINUTE, LAST_SECOND, LAST_MS];

export const SPLIT_START = 0;

export const TIMEOUT_NO_DELAY = 0;

export const ORDERS_MAX_COMMENT_LENGTH = 40;

export const STATUS_STEPS = ['DRAFT', 'ACCEPTED', 'DELIVERY', 'DONE'];

export const ONE_THIRD_PERCENT = 33.33;

export const STATUS_COLORS: { [key: string]: string } = {
    DRAFT: '#FFFFFF',
    ACCEPTED: '#7BD0E5',
    DELIVERY: '#98783B',
    DONE: '#3C3E6B',
};

export const RETRY_INTERVAL_SEC = 30;
export const ONE_SECOND_IN_MS = 1000;
export const HUNDRED_PERCENT = 100;
export const COUNTDOWN_END = 1;
export const COUNTDOWN_STEP = 1;
