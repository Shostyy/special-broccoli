import React from 'react';
import { useAppSelector } from '../../../types/hooks';
import { UnauthorizedView } from '../../views/UnauthorizedView';
import { AuthorizedView } from '../../views/AuthorizedView';

const AuthChecker: React.FC = () => {
    const userInfo = useAppSelector(state => state.login.userInfo);
    const isLoading = useAppSelector(state => state.login.loading);

    if (isLoading) {
        return (<>loading</>)
    } else {
        if (!userInfo) {
            return (<UnauthorizedView />)
        } else {
            return (<AuthorizedView />)
        }
    }

}

export default AuthChecker;