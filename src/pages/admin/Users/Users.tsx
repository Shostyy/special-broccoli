import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../types/hooks';
import { fetchUsersRelationshipAsync } from '../../../redux/slices/usersRelationshipSlice';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ManageUserRelationship } from './components/ManageUserRelationship';
import { RelationshipTable } from './components/RelationshipTable';
import { UsersTable } from './components/UsersTable';
import { useTranslation } from 'react-i18next';

const Users: React.FC = () => {
    const dispatch = useAppDispatch();
    const [tableMode, setTableMode] = useState<'users' | 'relationships'>('users');
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchUsersRelationshipAsync());
    }, [dispatch]);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newMode: 'users' | 'relationships') => {
        if (newMode) {
            setTableMode(newMode);
        }
    };

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full relative">
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: '20px',
                    }}
                >
                    <ToggleButtonGroup
                        value={tableMode}
                        exclusive
                        onChange={handleChange}
                        aria-label="Table Mode"
                        sx={{bgcolor: '#fff'}}
                    >
                        <ToggleButton value="users">{t('Users')}</ToggleButton>
                        <ToggleButton value="relationships">{t('Relationships')}</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {tableMode === 'users' && <UsersTable />}
                {tableMode === 'relationships' && (
                    <>
                        {/* Render RelationshipTable component here */}
                        <RelationshipTable />
                        {/* Render ManageUserRelationship component here */}
                        <ManageUserRelationship />
                    </>
                )}
            </div>
            {/* Placeholder for EditUserForm or any other component */}
        </div>
    );
}

export default Users;
