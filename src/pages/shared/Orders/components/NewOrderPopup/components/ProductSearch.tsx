import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/styles.module.css';

interface ProductSearchProps {
    searchTerm: string;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchTerm, onSearch }) => {
    const { t } = useTranslation();

    return (
        <input
            type="text"
            className={styles.searchBar}
            placeholder={t('SearchByName')}
            value={searchTerm}
            onChange={onSearch}
        />
    );
};

export default ProductSearch;