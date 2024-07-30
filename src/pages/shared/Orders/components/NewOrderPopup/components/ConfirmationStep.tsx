import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import ProductList from './ProductList';
import styles from '../styles/styles.module.css';
import { PresentProduct } from '../../../../../../api/types/presentProduct';
import ErrorSuccessMessage from '../../../../../../components/common/ErrorSuccessMessage/ErrorSuccessMessage';

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
    confirmationError: string | null | undefined;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    selectedProducts,
    handleProductSelect,
    handleProductRemove,
    setSelectedProducts,
    comment,
    setComment,
    onBack,
    onConfirm,
    confirmationError,
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
            <div className={styles.commentSection}>
                <label htmlFor="comment" className={styles.commentLabel}>{t('Comment')}</label>
                <textarea
                    id="comment"
                    className={styles.commentInput}
                    placeholder={t('CommentToOrder')}
                    rows={4}
                    maxLength={255}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <div className="h-6">
                {confirmationError && (
                    <span className="text-red-500">{t(confirmationError)}</span>
                )}
            </div>
            <Box className={styles.confirmationButtons}>
                <button onClick={onBack} className={styles.backButton}>
                    {t('ReturnToSelection')}
                </button>
                <button
                    onClick={onConfirm}
                    className={styles.confirmButton}
                    disabled={selectedProducts.length === 0}
                >
                    {t('ConfirmOrder')}
                </button>
            </Box>
        </div>
    );
};

export default ConfirmationStep;