import React from 'react';
import { SubCategory as SubCategoryType } from './shared/types/types';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styles from './styles/styles.module.css';
import { Tooltip } from '@mui/material';

interface SubCategoryProps {
    subCategory: SubCategoryType;
    isNavigationOpen: boolean;
}

const SubCategory: React.FC<SubCategoryProps> = ({ subCategory, isNavigationOpen }) => {
    const { t } = useTranslation();

    return (
        <li key={subCategory.name}>
            <div className="flex items-center">
                <NavLink
                    to={subCategory.link}
                    className={({ isActive }) =>
                        `${styles.subcategoryItem} ${isActive ? styles.subcategoryItemActive : ''} ${!isNavigationOpen ? styles.subcategoryItemClosed : ''}`
                    }
                >
                    {subCategory.icon && (
                        isNavigationOpen ? (
                            <img
                                src={subCategory.icon}
                                className={`${styles.categoryIcon}`}
                                alt='Menu icon'
                            />
                        ) : (
                            <Tooltip title={t(subCategory.name)} placement='right-end'>
                                <img
                                    src={subCategory.icon}
                                    className={`${styles.categoryIcon} ${styles.categoryIconClosed}`}
                                    alt='Menu icon'
                                />
                            </Tooltip>
                        )
                    )}

                    {isNavigationOpen && (
                        <span className="text-m font-medium">
                            {t(subCategory.name)}
                        </span>
                    )}
                </NavLink>
            </div>
        </li>
    );
};

export default SubCategory;
