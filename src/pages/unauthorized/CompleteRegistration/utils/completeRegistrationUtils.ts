import { NavigateFunction } from 'react-router-dom';
import {
    CompleteRegistrationData,
} from '../../../../api/postTypes/completeRegistrationData';
import { AppDispatch } from '../../../../redux/store/store';
import unauthorizedApi from '../../../../api/methods/unauthorizedApi';
import {
    setErrorMessage,
    setSuccessMessage,
    resetState,
} from '../../../../redux/slices/unauthorizedViewSlice';
import { REDIRECT_TO_LOGIN_DELAY } from '../../../../data/constants/constants';

export const handleCompleteRegistration = async (
    newPasswordData: CompleteRegistrationData,
    dispatch: AppDispatch,
    navigate: NavigateFunction,
) => {
    dispatch(resetState());

    try {
        await unauthorizedApi.completeRegistration(newPasswordData);
        const messages = {
            title: 'UpdAuthDataTitle',
            message: 'PwNotification',
        };
        dispatch(setSuccessMessage(messages));
    } catch {
        const messages = {
            title: 'UpdAuthDataTitle',
            message: 'PwUpdateError',
        };
        dispatch(setErrorMessage(messages));
    } finally {
        setTimeout(() => {
            dispatch(resetState());
            navigate('/login');
        }, REDIRECT_TO_LOGIN_DELAY);
    }
};