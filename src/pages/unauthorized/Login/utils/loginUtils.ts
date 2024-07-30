import { UNAUTHORIZED_STATUS_CODE } from '../../../../data/constants/constants';
import {
    setErrorMessage,
} from '../../../../redux/slices/unauthorizedViewSlice';
import { AppDispatch } from '../../../../redux/store/store';
import { ErrorMessages } from '../types/LoginTypes';

export const handleLoginError = (error: any, dispatch: AppDispatch) => {
    if (error.status === UNAUTHORIZED_STATUS_CODE) {
        const messages: ErrorMessages = {
            title: 'IncorrectUserNameOrPasswordTitle',
            message: 'IncorrectUserNameOrPassword',
        };
        dispatch(setErrorMessage(messages));
    }
};