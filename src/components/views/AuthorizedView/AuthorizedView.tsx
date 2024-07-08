import React from 'react';
import { UserInfo } from '../../../api/types/userInfo';
import { useAppSelector } from '../../../types/hooks';
import { AdminRoutes } from '../../auth/AdminRoutes';
import { ClientRoutes } from '../../auth/ClientRoutes';
import { Navigation } from '../../layout/Navigation';
import { Header } from '../../layout/Header';
import { PendingUpdates } from '../../layout/PendingUpdates';
import styles from './styles/styles.module.css';

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

    return (
        <div className={styles.mainWrapper}> {/* Main flex container */}
            <Navigation />
            <div className="flex flex-col flex-1"> {/* Container for header and main content */}
                <Header />
                <main className={styles.main}> {/* Main content */}
                
                    {userInfo ? <AuthorizedView userInfo={userInfo} /> : <div>Loading...</div>}
                    <PendingUpdates />
                </main>
            </div>
        </div>
    );
}

export default Layout;
