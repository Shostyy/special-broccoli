import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { logoutAsync } from '../../../../redux/slices/loginSlice';
import { LanguageSelector } from '../../../common';
import CloseIcon from '@mui/icons-material/Close';
import { appIcons, categoriesIcons } from '../../../../data/constants/icons';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip } from '@mui/material';

interface ProfilePopupProps {
    isOpen: boolean;
    onCloseClick: () => void;
    profileIcon: string;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onCloseClick, profileIcon }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.login.userInfo);
    const popupRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleNavigateToSettings = () => {
        navigate('account');
        onCloseClick();
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onCloseClick();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onCloseClick]);

    const handleSignOut = async () => {
        try {
            await dispatch(logoutAsync());
            window.location.reload();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    if (!isOpen || !userInfo) {
        return null;
    }

    const bgColor = userInfo?.role.name === 'ADMIN' ? '#c25458' : '#3c3e6b';

    return (
        <div className="absolute top-[70px] right-0 z-50">
            <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-64">
                <div className='flex justify-end mb-6'>
                    <button onClick={onCloseClick} className='text-gray-500 hover:text-gray-700'>
                        <CloseIcon className='w-5 h-5' />
                    </button>
                </div>
                <div className='flex flex-col items-center gap-4 mb-6'>
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-full shadow-md text-sm font-medium text-white border-2 border-white relative"
                        style={{
                            backgroundColor: bgColor,
                            boxShadow: `0 0 0 2px ${bgColor}, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                        }}
                    >

                        <img src={appIcons.person} alt='Profile icon' className="w-7 h-7" />
                    </div>

                    <div className="text-center">
                        <span className="font-semibold">{userInfo.login}</span>
                        <span className="text-xs text-gray-500 uppercase ml-2">{t(userInfo.role.name)}</span>
                    </div>
                    <span className="text-sm text-gray-600">{userInfo.email}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <Tooltip title={t('SignOut')}>
                        <button
                            onClick={handleSignOut}
                            className="w-16   py-2 text-white rounded-md transition duration-300 flex items-center justify-center"
                            style={{
                                backgroundColor: '#c25458',
                            }}
                        >
                            <LogoutIcon />
                        </button>
                    </Tooltip>
                    <Tooltip title={t('ChangeLang')}>
                        <div className='w-16 '>
                            <LanguageSelector
                                widthFull={true}
                                onSelect={onCloseClick}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip title={t('Settings')}>
                        <button
                            onClick={handleNavigateToSettings}
                            className="w-16 py-2 bg-white rounded-md transition duration-300 flex items-center justify-center"
                            style={{
                                color: '#c25458',
                                border: '1px solid #c25458',
                            }}
                        >
                            <SettingsIcon />
                        </button>
                    </Tooltip>
                </div>

            </div>
        </div>
    );
};

export default ProfilePopup;