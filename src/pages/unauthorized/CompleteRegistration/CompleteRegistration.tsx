import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../types/hooks';
import { useCompleteRegistrationValidation } from './hooks/useCompleteRegistrationValidation';
import { CompleteRegistrationFormValues } from './types/CompleteRegistrationTypes';
import { handleCompleteRegistration } from './utils/completeRegistrationUtils';
import { CompleteRegistrationForm } from './components/CompleteRegistrationForm';

const CompleteRegistration: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const validationSchema = useCompleteRegistrationValidation();

    const handleSubmit = (values: CompleteRegistrationFormValues) => {
        if (userId) {
            const newPasswordData = {
                id: userId,
                temporaryPassword: values.temporaryPassword,
                newPassword: values.newPassword,
            };
            handleCompleteRegistration(newPasswordData, dispatch, navigate);
        }
    };

    return (
        <CompleteRegistrationForm
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        />
    );
};

export default CompleteRegistration;