import { Dispatch, SetStateAction, RefObject } from 'react';
import { TFunction } from 'i18next';
import { EmailFormValues, PasswordFormValues, UserData, ChangeEmailData, ChangePasswordData } from '../types/AccountTypes';
import { handleSetMessageTemporarily } from '../../../../utils/handleSetMessageTemporarily';
import userApi from '../../../../api/methods/userApi';
import {
  INCORRECT_CURRENT_PASSWORD_STATUS_CODE,
  OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION,
} from '../../../../data/constants/constants';

const messageDuration = OVER_UI_SUCCESS_ERROR_MESSAGE_DURATION;

export const changeEmail = async (
  values: EmailFormValues,
  userData: UserData | null,
  setSuccessMessage: Dispatch<SetStateAction<string | null>>,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  timerIdRef: RefObject<NodeJS.Timeout | null>,
  t: TFunction,
) => {
  if (userData?.id && values.email) {
    const newEmailData: ChangeEmailData = {
      id: userData.id,
      email: values.email,
    };
    try {
      await userApi.changeEmail(newEmailData);
      handleSetMessageTemporarily('EmailNotification', setSuccessMessage, timerIdRef, t, messageDuration);
    } catch {
      handleSetMessageTemporarily('EmailUpdateError', setErrorMessage, timerIdRef, t, messageDuration);
    }
  }
};

export const changePassword = async (
  values: PasswordFormValues,
  userData: UserData | null,
  setSuccessMessage: Dispatch<SetStateAction<string | null>>,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  setPasswordChangeError: Dispatch<SetStateAction<boolean>>,
  timerIdRef: RefObject<NodeJS.Timeout | null>,
  t: TFunction,
) => {
  if (userData?.id) {
    const newPasswordData: ChangePasswordData = {
      id: userData.id,
      password: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      await userApi.changePassword(newPasswordData);
      handleSetMessageTemporarily('PwNotification', setSuccessMessage, timerIdRef, t, messageDuration);
      setPasswordChangeError(false);
    } catch (error: any) {
      if (error && error.status === INCORRECT_CURRENT_PASSWORD_STATUS_CODE) {
        handleSetMessageTemporarily('ChangePwError', setErrorMessage, timerIdRef, t, messageDuration);
      } else {
        handleSetMessageTemporarily('PwUpdateError', setErrorMessage, timerIdRef, t, messageDuration);
      }
    }
  }
};