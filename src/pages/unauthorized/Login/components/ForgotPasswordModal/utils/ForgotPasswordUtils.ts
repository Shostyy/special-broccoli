import unauthorizedApi from '../../../../../../api/methods/unauthorizedApi';
import {
    resetState,
    setErrorMessage,
    setSuccessMessage,
} from '../../../../../../redux/slices/unauthorizedViewSlice';
import { AppDispatch } from '../../../../../../redux/store/store';


export const handleForgotPasswordSubmit = async (
    email: string,
    dispatch: AppDispatch,
    onClose: () => void,
) => {
    dispatch(resetState());
    try {
        await unauthorizedApi.resetPasswordInit(email);
        const messages = {
            title: 'UpdAuthDataTitle',
            message: 'CheckYourInbox',
        };
        dispatch(setSuccessMessage(messages));
    } catch {
        const messages = {
            title: 'GeneralError',
            message: 'UserNotRegisteredError',
            additionalInfo: email,
        };
        dispatch(setErrorMessage(messages));
    } finally {
        onClose();
    }
};