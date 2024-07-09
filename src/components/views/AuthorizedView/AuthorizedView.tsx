import React, { useState } from 'react';
import { useAppSelector } from '../../../types/hooks';
import { AdminRoutes } from '../../auth/AdminRoutes';
import { ClientRoutes } from '../../auth/ClientRoutes';
import { Navigation } from '../../layout/Navigation';
import { Header } from '../../layout/Header';
import { PendingUpdates } from '../../layout/PendingUpdates';
import styles from './styles/styles.module.css';
import { UserInfo } from '../../../api/types/userInfo';

interface AuthorizedViewProps {
    userInfo: UserInfo;
}

const AuthorizedView: React.FC<AuthorizedViewProps> = ({ userInfo }) => {
    const userRole = userInfo?.role?.name;

    switch (userRole) {
        case 'ADMIN':
            return <AdminRoutes />;
        case 'CLIENT':
            return <ClientRoutes />;
        default:
            return <div>Error. Unknown user role</div>;
    }
}

const Layout: React.FC = () => {
    const userInfo = useAppSelector(state => state.login.userInfo);
    const isNavOpen = useAppSelector(state => state.navigation.isNavigationOpen);

    return (
        <div className={styles.mainWrapper}>
            <Navigation />
            <div className={styles.contentWrapper}>
                <Header />
                <main className={styles.main}>
                    {userInfo ? <AuthorizedView userInfo={userInfo} /> : <div>Loading...</div>}
                    <PendingUpdates />
                </main>
            </div>
        </div>
    );
}

export default Layout;
