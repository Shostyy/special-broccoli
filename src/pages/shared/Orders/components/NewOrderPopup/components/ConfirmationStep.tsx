import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import ProductList from './ProductList';
import styles from '../styles/styles.module.css';
import { PresentProduct } from '../../../../../../api/types/presentProduct';

interface ConfirmationStepProps {
    selectedProducts: PresentProduct[];
    handleProductSelect: (product: PresentProduct) => void;
    handleProductRemove: (product: PresentProduct) => void;
    setSelectedProducts: React.Dispatch<React.SetStateAction<PresentProduct[]>>;
    totalSelectedSum: number;
    comment: string;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    onBack: () => void;
    onConfirm: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    selectedProducts,
    handleProductSelect,
    handleProductRemove,
    setSelectedProducts,
    totalSelectedSum,
    comment,
    setComment,
    onBack,
    onConfirm
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.confirmationStep}>
            <ProductList
                selectedProducts={selectedProducts}
                handleProductSelect={handleProductSelect}
                handleProductRemove={handleProductRemove}
                setSelectedProducts={setSelectedProducts}
                displayType="selected"
            />
            <span className={styles.totalSum}>
                {t('Sum')}: {totalSelectedSum.toFixed(2)} ₴
            </span>
            <div className={styles.commentSection}>
                <label htmlFor="comment" className={styles.commentLabel}>{t('Comment')}</label>
                <textarea
                    id="comment"
                    className={styles.commentInput}
                    placeholder={t('CommentToOrder')}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <Box className={styles.confirmationButtons}>
                <button onClick={onBack} className={styles.backButton}>
                    {t('ReturnToSelection')}
                </button>
                <button onClick={onConfirm} className={styles.confirmButton}>
                    {t('ConfirmOrder')}
                </button>
            </Box>
        </div>
    );
};

export default ConfirmationStep;