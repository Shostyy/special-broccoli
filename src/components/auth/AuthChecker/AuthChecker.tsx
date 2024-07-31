import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../types/hooks';
import { UnauthorizedView } from '../../views/UnauthorizedView';
import { AuthorizedView } from '../../views/AuthorizedView';
import { CountdownModal, FullPageLoader } from '../../common';
import { fetchUserInfoAsync } from '../../../redux/slices/loginSlice';

const AuthChecker: React.FC = () => {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.login.userInfo);
    const isLoading = useAppSelector(state => state.login.loading);
    const error = useAppSelector(state => state.login.error);
    const [showModal, setShowModal] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        dispatch(fetchUserInfoAsync());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading) {
            setHasCheckedAuth(true);
        }
    }, [isLoading]);

    useEffect(() => {
        if (error === 'Failed to fetch user info') {
            setShowModal(true);
        }
    }, [error]);

    const handleReload = () => {
        window.location.reload();
    };

    if (!hasCheckedAuth || isLoading) {
        return <FullPageLoader />;
    }

    if (showModal) {
        return (
            <>
                <FullPageLoader />
                <CountdownModal onReload={handleReload} />
            </>
        );
    }

    if (!userInfo && hasCheckedAuth) {
        return <UnauthorizedView />;
    }

    if (userInfo) {
        return <AuthorizedView />;
    }

    return <FullPageLoader />;
}

export default AuthChecker;