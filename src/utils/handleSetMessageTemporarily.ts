import { TFunction } from 'i18next';
import {
    OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION,
} from '../data/constants/constants';

export const handleSetMessageTemporarily = (
    translationKey: string,
    setFunction: React.Dispatch<React.SetStateAction<string | null>>,
    timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
    t: TFunction<'translation', undefined>,
    timeoutDuration: number = OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION,
) => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }

    setFunction(t(translationKey));

    timerRef.current = setTimeout(() => {
        setFunction(null);
        timerRef.current = null;
    }, timeoutDuration);
};
