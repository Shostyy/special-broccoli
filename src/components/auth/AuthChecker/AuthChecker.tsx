import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../types/hooks';
import { UnauthorizedView } from '../../views/UnauthorizedView';
import { AuthorizedView } from '../../views/AuthorizedView';
import { CountdownModal, FullPageLoader } from '../../common';

const AuthChecker: React.FC = () => {
    const userInfo = useAppSelector(state => state.login.userInfo);
    const isLoading = useAppSelector(state => state.login.loading);
    const error = useAppSelector(state => state.login.error);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (error === 'Failed to fetch user info') {
            setShowModal(true);
        }
    }, [error]);

    const handleReload = () => {
        window.location.reload();
    };

    if (isLoading) {
        return <FullPageLoader />;
    } 

    if (showModal) {
        return (
            <div>
                <UnauthorizedView />
                <CountdownModal onReload={handleReload} />
            </div>
        );
    } 
    
    if (!userInfo) {
        return <UnauthorizedView />;
    } 

    return <AuthorizedView />;
}

export default AuthChecker;
