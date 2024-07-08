import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
    Users,
    Register,
    Roles,
    BranchOffices,
    Customers,
    TradePoints,
    Categories,
    Products,
    ProductRemains,
    ProductPrices,
    PostServer,
    ProducedReport,
    Materials,
    Models,
    CommercialEquipment,
    CommercialEquipmentControls,
    CounterDrinkPrices
} from '../../../pages/admin';
import { Account, Orders, Debts } from '../../../pages/shared';

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Navigate to="/"/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/branch-offices" element={<BranchOffices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/trade-points" element={<TradePoints />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product-prices" element={<ProductPrices />} />
            <Route path="/product-remains" element={<ProductRemains />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/postserver" element={<PostServer />} />
            <Route path="/account" element={<Account />} />
            <Route path="/produced-report" element={<ProducedReport />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/models" element={<Models />} />
            <Route path="/commercial-equipment" element={<CommercialEquipment />} />
            <Route path="/commercial-equipment-controls" element={<CommercialEquipmentControls />} />
            <Route path="/counters-drink-prices" element={<CounterDrinkPrices />} />
            <Route path="*" element={<p>404</p>} />
        </Routes>
    );
}

export default AdminRoutes;
