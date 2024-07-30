import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { ProductsRemain } from '../../../../api/types/productsRemain';
import { useProductRemainsColumns } from '../hooks/useProductRemainsColumns';

interface ProductRemainsTableProps {
    items: ProductsRemain[];
}

const ProductRemainsTable: React.FC<ProductRemainsTableProps> = ({ items }) => {
    const columns = useProductRemainsColumns();

    return (
        <SimpleTable
            columns={columns}
            rows={items}
            customRowHeight={54}
        />
    );
};

export default ProductRemainsTable;