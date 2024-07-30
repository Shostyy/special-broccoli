import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from '../styles/styles.module.css';

interface CategoryListProps {
  groupedProducts: { [category: string]: any[] };
  expandedCategories: { [category: string]: boolean };
  toggleCategory: (category: string) => void;
  handleSelectAllCategories: () => void;
  handleClearCategories: () => void;
  updateStatus: 'idle' | 'pending' | 'success' | 'error';
  selectedTradePoint: any | null;
  initializeError: string | null | undefined;
}

const CategoryList: React.FC<CategoryListProps> = ({
  groupedProducts,
  expandedCategories,
  toggleCategory,
  handleSelectAllCategories,
  handleClearCategories,
  updateStatus,
  selectedTradePoint,
  initializeError,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.categoryList}>
      {Object.keys(groupedProducts).map(category => (
        <div
          key={category}
          className={`${styles.categoryItem} ${expandedCategories[category] ? styles.activeCategory : ''}`}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </div>
      ))}
      {Object.keys(groupedProducts).length > 0 && (
        <div className={styles.categoryButtonWrapper}>
          <button onClick={handleSelectAllCategories} className={styles.categoryButton}>
            {t('SelectAll')}
          </button>
          <button onClick={handleClearCategories} className={styles.categoryButton}>
            {t('Clear')}
          </button>
        </div>
      )}
      {Object.keys(groupedProducts).length === 0 && updateStatus === 'pending' && (
        <Box className={styles.loaderBox}>
          <CircularProgress className={styles.loader} />
        </Box>
      )}
      {Object.keys(groupedProducts).length === 0 && updateStatus === 'idle' && !selectedTradePoint && (
        <span className={styles.noTradePointMessage}>
          {t('ChooseTradePoint')}
        </span>
      )}
      <div className='space-y-2'>
        {initializeError && (
          <div className='p-2 bg-red-100 border border-red-400 text-red-700 rounded'>
            <span>{t(initializeError)}</span>
          </div>
        )}
        {updateStatus === 'error' && (
          <div className='p-2 bg-red-100 border border-red-400 text-red-700 rounded'>
            <span>{t('PricesAndRemainsUpdError')}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryList;