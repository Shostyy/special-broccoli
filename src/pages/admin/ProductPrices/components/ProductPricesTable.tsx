import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { useProductPriceColumns } from '../hooks/useProductPriceColumns';
import { ProductPrice } from '../../../../api/types/productPrice';

interface ProductPricesTableProps {
    items: ProductPrice[];
}

const ProductPricesTable: React.FC<ProductPricesTableProps> = ({ items }) => {
    const columns = useProductPriceColumns();

    return (
        <SimpleTable
            columns={columns}
            rows={items}
            customRowHeight={54}
            customHeaderHeight={184}
        />
    );
};

export default ProductPricesTable;