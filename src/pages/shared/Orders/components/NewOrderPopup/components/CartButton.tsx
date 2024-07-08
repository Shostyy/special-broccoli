import React from 'react';
import { useTranslation } from 'react-i18next';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import styles from '../styles/styles.module.css';

interface CartButtonProps {
    totalSelectedSum: number;
    onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ totalSelectedSum, onClick }) => {
    const { t } = useTranslation();

    return (
        <button className={styles.cartButton} onClick={onClick}>
            {t('SelectedProducts')}
            <ShoppingBagIcon />
            {totalSelectedSum.toFixed(2)} ₴
        </button>
    );
};

export default CartButton;