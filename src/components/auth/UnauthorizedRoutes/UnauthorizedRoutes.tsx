import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
    Login,
    ResetPassword,
    CompleteRegistration
} from '../../../pages/unauthorized';

const UnauthorizedRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/complete-registration/:userId" element={<CompleteRegistration />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default UnauthorizedRoutes;