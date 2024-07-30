import React from 'react';
import { useTranslation } from 'react-i18next';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import styles from '../styles/styles.module.css';

interface CartButtonProps {
    totalSelectedSum: number;
    onClick: () => void;
    tradePointSelected: boolean;
}

const CartButton: React.FC<CartButtonProps> = ({ totalSelectedSum, onClick, tradePointSelected }) => {
    const { t } = useTranslation();

    return (
        <button className={styles.cartButton} onClick={onClick} disabled={!tradePointSelected}>
            {t('SelectedProducts')}
            <ShoppingBagIcon />
            {totalSelectedSum.toFixed(2)} ₴
        </button>
    );
};

export default CartButton;