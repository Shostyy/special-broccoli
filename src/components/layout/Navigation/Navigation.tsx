import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { unauthorizedCategories } from './shared/data/unauthorizedCategories';
import { adminCategories } from './shared/data/adminCategories';
import { clientCategories } from './shared/data/clientCategories';
import { Category as CategoryType } from './shared/types/types';
import Category from './Category';
import logo from '../../../assets/images/logo.svg';
import styles from './styles/styles.module.css';
import { useTranslation } from 'react-i18next';
import { logoutAsync } from '../../../redux/slices/loginSlice';
import { categoriesIcons } from '../../../data/constants/icons';

const Navigation: React.FC = () => {
    const userRole = useAppSelector(state => state.login.userInfo?.role.name || '');
    const isNavigationOpen = useAppSelector(state => state.navigation.isNavigationOpen);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const getCategoriesByRole = (userRole: string | undefined) => {
        switch (userRole) {
            case 'ADMIN':
                return adminCategories;
            case 'CLIENT':
                return clientCategories;
            default:
                return unauthorizedCategories;
        }
    };

    const userCategories = getCategoriesByRole(userRole);

    return (
        <nav className={`${styles.navigation} ${isNavigationOpen ? '' : styles.navigationClosed}`}>
            <div className={styles.logoWrapper}>
                <img src={logo} className={styles.logoImage} alt="tsa logo" />
            </div>
            <ul className={styles.navigationList}>
                {userCategories.map((category: CategoryType) => (
                    <Category key={category.name} category={category} isNavigationOpen={isNavigationOpen} />
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
