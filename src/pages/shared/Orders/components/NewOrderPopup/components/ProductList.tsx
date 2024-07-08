import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/styles.module.css';
import { PresentProduct } from '../../../../../../api/types/presentProduct';

interface ProductListProps {
    groupedProducts?: Record<string, PresentProduct[]>;
    expandedCategories?: Record<string, boolean>;
    selectedProducts: PresentProduct[];
    handleProductSelect: (product: PresentProduct) => void;
    handleProductRemove: (product: PresentProduct) => void;
    setSelectedProducts: React.Dispatch<React.SetStateAction<PresentProduct[]>>;
    filteredProducts?: (category: string) => PresentProduct[];
    displayType: 'full' | 'selected';
}

const ProductList: React.FC<ProductListProps> = ({
    groupedProducts,
    expandedCategories,
    selectedProducts,
    handleProductSelect,
    handleProductRemove,
    setSelectedProducts,
    filteredProducts,
    displayType
}) => {
    const { t } = useTranslation();

    const renderFullTable = () => (
        <Table sx={{ padding: '20px', marginTop: '20px' }}>
            <TableHead>
                <TableRow sx={{ bgcolor: '#d9d9d9' }}>
                    <TableCell align="left">{t('ID')}</TableCell>
                    <TableCell align="left">{t('Name')}</TableCell>
                    <TableCell align="left">{t('PriceUAH')}</TableCell>
                    <TableCell align="left">{t('Unit')}</TableCell>
                    <TableCell align="left">{t('Category')}</TableCell>
                    <TableCell align="left">{t('Quantity')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {groupedProducts && expandedCategories && filteredProducts && Object.entries(groupedProducts).map(([category, products]) => (
                    expandedCategories[category] && (
                        filteredProducts(category).map(product => {
                            const cartProduct = selectedProducts.find(p => p.productId === product.productId);
                            return (
                                <TableRow
                                    key={product.productId}
                                    sx={{ height: '58px' }}
                                    onClick={() => {
                                        if (!cartProduct) {
                                            handleProductSelect(product);
                                        }
                                    }}
                                >
                                    <TableCell align="left">{product.productId}</TableCell>
                                    <TableCell align="left">{product.productName}</TableCell>
                                    <TableCell align="left">{product.price} ₴</TableCell>
                                    <TableCell align="left">{product.unit}</TableCell>
                                    <TableCell align="left">{category}</TableCell>
                                    <TableCell align="left">
                                        {cartProduct ? (
                                            <div className={styles.quantityButtons}>
                                                <button className={styles.quantityButton} onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductRemove(product);
                                                }}>-</button>
                                                <input
                                                    type="string"
                                                    className={styles.quantityInput}
                                                    value={cartProduct.quantity}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        const value = parseInt(e.target.value, 10);
                                                        setSelectedProducts(prevSelected => prevSelected.map(p =>
                                                            p.productId === product.productId ? { ...p, quantity: value } : p
                                                        ));
                                                    }}
                                                    min={1}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button className={styles.quantityButton} onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductSelect(product);
                                                }}>+</button>
                                            </div>
                                        ) : (
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductSelect(product);
                                            }}>
                                                {t('Add')}
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )
                ))}
            </TableBody>
        </Table>
    );

    const renderSelectedTable = () => (
        <Table sx={{ padding: '20px', marginTop: '20px' }}>
            <TableHead>
                <TableRow sx={{ bgcolor: '#d9d9d9' }}>
                    <TableCell align="left">{t('ID')}</TableCell>
                    <TableCell align="left">{t('Name')}</TableCell>
                    <TableCell align="left">{t('PriceUAH')}</TableCell>
                    <TableCell align="left">{t('Unit')}</TableCell>
                    <TableCell align="left">{t('Quantity')}</TableCell>
                    <TableCell align="left">{t('Total')}</TableCell>
                    <TableCell align="left"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {selectedProducts.map(product => (
                    <TableRow key={product.productId}>
                        <TableCell align="left">{product.productId}</TableCell>
                        <TableCell align="left">{product.productName}</TableCell>
                        <TableCell align="left">{product.price} ₴</TableCell>
                        <TableCell align="left">{product.unit}</TableCell>
                        <TableCell align="left">
                            <div className={styles.quantityButtons}>
                                <button className={styles.quantityButton} onClick={() => handleProductRemove(product)}>-</button>
                                <input
                                    type="string"
                                    className={styles.quantityInput}
                                    value={product.quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        setSelectedProducts(selectedProducts.map(p =>
                                            p.productId === product.productId ? { ...p, quantity: value } : p
                                        ));
                                    }}
                                    min={1}
                                />
                                <button className={styles.quantityButton} onClick={() => handleProductSelect(product)}>+</button>
                            </div>
                        </TableCell>
                        <TableCell align="left">{(product.price * product.quantity).toFixed(1)}₴</TableCell>
                        <TableCell align="left">
                            <button className={styles.removeButton} onClick={() => handleProductRemove(product)}>
                                <CloseIcon sx={{ fontSize: '18px' }} />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className={styles.productList}>
            {displayType === 'full' ? renderFullTable() : renderSelectedTable()}
        </div>
    );
}

export default ProductList;