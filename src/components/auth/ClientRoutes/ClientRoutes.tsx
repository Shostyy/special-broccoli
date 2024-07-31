import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Account, Orders, Debts } from '../../../pages/shared';
import { CounterDrinkPrices } from '../../../pages/admin';
import ClientDataLoader from '../ClientDataLoader/ClientDataLoader';

const ClientRoutes: React.FC = () => {
    return (
        <ClientDataLoader>
            <Routes>
                <Route path="/" element={<></>} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/account" element={<Account />} />
                <Route path="/counters-drink-prices" element={<CounterDrinkPrices />} />
                <Route path="*" element={<p>404</p>} />
            </Routes>
        </ClientDataLoader>
    );
}

export default ClientRoutes;