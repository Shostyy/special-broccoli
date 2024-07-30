import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useProducts } from './hooks/useProducts';
import ProductsTable from './components/ProductsTable';
import { ProductData } from '../../../api/types/productData';

const Products: React.FC = () => {
  const { products, updateStatus, handleUpdate, loading } = useProducts();

  return (
    <HandbookPage<ProductData>
      items={products}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={ProductsTable}
    />
  );
};

export default Products;