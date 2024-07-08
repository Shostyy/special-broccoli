import React, { useState } from 'react';
import { Category as CategoryType } from './shared/types/types';
import { useTranslation } from 'react-i18next';
import SubCategory from './SubCategory';
import styles from './styles/styles.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { appIcons } from '../../../data/constants/icons';
import { Tooltip } from '@mui/material';

interface CategoryProps {
    category: CategoryType;
    isNavigationOpen: boolean;
}

const Category: React.FC<CategoryProps> = ({ category, isNavigationOpen }) => {
    const [isCategoryVisible, setIsCategoryVisible] = useState<boolean>(false);
    const { t } = useTranslation();

    const handleToggleVisibility = () => {
        setIsCategoryVisible(!isCategoryVisible);
    };

    return (
        <div>
            <button
                className={`${styles.menuItem} ${isNavigationOpen ? '' : styles.menuItemClosed} ${isCategoryVisible ? styles.menuItemOpened : ''}`}
                onClick={handleToggleVisibility}
            >
                <img
                    src={appIcons.arrowBottom}
                    className={`${styles.arrow} ${isCategoryVisible ? styles.arrowOpened : ''}`}
                />
                {category.icon && (
                    isNavigationOpen ? (
                        <img
                            src={category.icon}
                            className={`${styles.categoryIcon}`}
                            alt='icon'
                        />
                    ) : (
                        <Tooltip title={t(category.name)} placement='right-end'>
                            <img
                                src={category.icon}
                                className={`${styles.categoryIcon} ${styles.categoryIconClosed}`}
                                alt='icon'
                            />
                        </Tooltip>
                    )
                )}

                {isNavigationOpen && (
                    <span className="text-m font-medium">{t(category.name)}</span>
                )}
                {!isNavigationOpen && (
                    <span className={`${styles.categoryName} ${styles.categoryNameHidden}`}>{t(category.name)}</span>
                )}
            </button>
            <ul className={`${styles.subcategoryList} ${isCategoryVisible ? styles.subcategoryListVisible : ''}`}>
                {category.subCategory?.map((sub, index) => (
                    <SubCategory key={index} subCategory={sub} isNavigationOpen={isNavigationOpen} />
                ))}
            </ul>
        </div >
    );
};

export default Category;
