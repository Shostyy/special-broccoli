import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { useProductColumns } from '../hooks/useProductColumns';
import { ProductData } from '../../../../api/types/productData';

interface ProductsTableProps {
    items: ProductData[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ items }) => {
    const columns = useProductColumns();

    return (
        <SimpleTable
            columns={columns}
            rows={items}
            customRowHeight={54}
        />
    );
};

export default ProductsTable;