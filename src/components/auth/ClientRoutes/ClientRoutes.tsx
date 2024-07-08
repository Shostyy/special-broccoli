import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Account, Orders, Debts } from '../../../pages/shared';

const ClientRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="/login" element={<Navigate to="/"/>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<p>404</p>} />
        </Routes>
    );
}

export default ClientRoutes;