import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../types/hooks';
import { useResetPasswordValidation } from './hooks/useResetPasswordValidation';
import { handleResetPassword } from './utils/resetPasswordUtils';
import { ResetPasswordForm } from './components/ResetPasswordForm';

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const validationSchema = useResetPasswordValidation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = (newPassword: string) => {
        if (token) {
            const newPasswordData = {
                token: token,
                password: newPassword,
            };
            handleResetPassword(newPasswordData, dispatch, navigate);
        }
    };

    return <ResetPasswordForm
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    />;
};

export default ResetPassword;
