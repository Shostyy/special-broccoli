import React, { useState } from 'react';
import { useAppDispatch } from '../../../types/hooks';
import useLoginFormValidation from './hooks/useLoginFormValidation';
import { LoginFormValues } from './types/LoginTypes';
import loginApi from '../../../api/methods/loginApi';
import { handleLoginError } from './utils/loginUtils';
import { LoginForm } from './components/LoginForm';
import { fetchUserInfoAsync } from '../../../redux/slices/loginSlice';
// eslint-disable-next-line
import ForgotPasswordModal from './components/ForgotPasswordModal/ForgotPasswordModal';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const validationSchema = useLoginFormValidation();

    const togglePopupVisibility = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            await loginApi.login(values);
            dispatch(fetchUserInfoAsync());
        } catch (error: any) {
            handleLoginError(error, dispatch);
        }
    };

    return (
        <>
            <LoginForm
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                onForgotPassword={togglePopupVisibility}
            />
            <ForgotPasswordModal
                isPopupVisible={isPopupVisible}
                onClose={togglePopupVisibility}
            />
        </>
    );
};

export default Login;