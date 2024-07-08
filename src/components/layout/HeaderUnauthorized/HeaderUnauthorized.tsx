import MenuIcon from '@mui/icons-material/Menu';
import { LanguageSelector } from '../../common';
import { useAppDispatch } from '../../../types/hooks';
import { toggleNavigation as toggleNavigationAction } from '../../../redux/slices/navigationSlice';
import LocationText from '../../common/LocationText/LocationText';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const HeaderUnauthorized: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toggleNavigation = () => {
        dispatch(toggleNavigationAction());
    }

    const navigateToLogin = () => {
        navigate('/login');
    }

    return (
        <header className="header bg-gray-300 px-4 py-2 flex items-center justify-between border-b">
            {/* Left Container */}
            <div className="flex items-center">
                <button
                    onClick={toggleNavigation}
                    className="text-xl focus:outline-none flex items-center justify-center h-full"
                >
                    <MenuIcon className="w-7 h-7" />
                </button>
                <h2 className="ml-4 font-semibold"><LocationText /></h2>
            </div>

            {/* Right Container */}
            <div className="flex items-center gap-6">
                <LanguageSelector />
                <button
                    className="text-red-500 mr-4 font-semibold"
                    onClick={navigateToLogin}
                >
                    {t('Enter')}
                </button>
            </div>
        </header>
    )
}

export default HeaderUnauthorized;
