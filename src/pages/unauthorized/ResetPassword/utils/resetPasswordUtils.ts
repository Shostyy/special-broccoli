
import unauthorizedApi from '../../../../api/methods/unauthorizedApi';
import {
    EXPIRED_TOKEN_STATUS_CODE,
    REDIRECT_TO_LOGIN_DELAY,
} from '../../../../data/constants/constants';
import {
    resetState,
    setErrorMessage,
    setSuccessMessage,
} from '../../../../redux/slices/unauthorizedViewSlice';
import { AppDispatch } from '../../../../redux/store/store';
import { NewPasswordData } from '../types/ResetPasswordTypes';
import { NavigateFunction } from 'react-router-dom';

export const handleResetPassword = async (
    newPasswordData: NewPasswordData,
    dispatch: AppDispatch,
    navigate: NavigateFunction,
) => {
    dispatch(resetState());

    try {
        await unauthorizedApi.resetPassword(newPasswordData);
        const messages = {
            title: 'UpdAuthDataTitle',
            message: 'PwSuccessResetMessage',
        };
        dispatch(setSuccessMessage(messages));
    } catch (error: any) {
        const messages = {
            title: 'GeneralError',
            message:
                error.status === EXPIRED_TOKEN_STATUS_CODE
                    ? 'ExpiredTokenMessage'
                    : 'PwUpdateError',
        };
        dispatch(setErrorMessage(messages));
    } finally {
        setTimeout(() => {
            dispatch(resetState());
            navigate('/login');
        }, REDIRECT_TO_LOGIN_DELAY);
    }
};
