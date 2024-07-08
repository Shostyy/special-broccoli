import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ResetPassword } from '../../../pages/unauthorized/ResetPassword';
import { CompleteRegistration } from '../../../pages/unauthorized/CompleteRegistration';
import { Login } from '../../../pages/unauthorized/Login';

const UnauthorizedRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/complete-registration/:userId" element={<CompleteRegistration />} />
            <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
    );
}

export default UnauthorizedRoutes;