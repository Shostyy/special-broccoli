import { TFunction } from 'i18next';

export const handleSetMessageTemporarily = (
    translationKey: string,
    setFunction: React.Dispatch<React.SetStateAction<string | null>>,
    timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
    t: TFunction<"translation", undefined>,
    timeoutDuration: number = 5000
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
