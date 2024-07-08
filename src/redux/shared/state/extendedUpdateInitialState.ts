import { ExtendedUpdateSliceState } from '../types/extendedUpdateSliceState';

export const extendedUpdateInitialState: ExtendedUpdateSliceState = {
    loading: false,
    errorTranslationKey: null,
    updateStatus: 'idle',
    updateMessage: null,
};
