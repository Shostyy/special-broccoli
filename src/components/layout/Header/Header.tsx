import { LanguageSelector } from '../../common';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { toggleNavigation as toggleNavigationAction } from '../../../redux/slices/navigationSlice';
import LocationText from '../../common/LocationText/LocationText';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appIcons } from '../../../data/constants/icons';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileModal from './components/ProfileModal';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const userInfo = useAppSelector(state => state.login.userInfo);
    const { t } = useTranslation();
    
    const toggleNavigation = () => {
        dispatch(toggleNavigationAction());
    };

    const handleProfileMenuClose = () => {
        setProfileMenuOpen(false);
    };

    const handleToggleProfile = () => {
        setProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <header className="header px-4 py-2 flex items-center justify-between h-28 pr-8">
            {/* Left Container */}
            <div className="flex items-center justify-center">

                <button onClick={toggleNavigation} className="text-xl focus:outline-none flex items-center justify-center h-full">
                    <MenuIcon className="w-7 h-7 text-white" />
                </button>

                <h2 className="ml-4 font-semibold text-2xl text-white"><LocationText /></h2>
            </div>

            {/* Right Container */}
            <div className="flex items-center gap-5">
                <span className="text-white font-bold text-lg">{userInfo?.login}</span>
                <div className="relative">
                    <div className="relative">
                        <button
                            onClick={handleToggleProfile}
                            className="px-3 text-white rounded focus:outline-none flex items-center"
                        >
                            <div
                                className="flex items-center justify-center w-12 h-12 text-center rounded-full shadow-sm text-sm font-medium text-white relative"
                                style={{
                                    background: userInfo?.role.name === 'ADMIN' ? '#C25458' : '#3C3E6B',
                                    border: '1px solid #FFF',
                                }}
                            >
                                <img src={appIcons.person} alt='Profile icon' />
                                {/* Profile Modal */}
                            </div>
                        </button>
                        <ProfileModal
                            isOpen={isProfileMenuOpen}
                            onCloseClick={handleProfileMenuClose}
                            profileIcon={appIcons.person}
                        />
                    </div>
                </div>
            </div>


        </header>
    );
}

export default Header;
