import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress } from '@mui/material';
import { ProductData } from '../../../api/types/productData';
import { fetchProductsAsync, updateProducts } from '../../../redux/slices/productsSlice';
import { MRT_ColumnDef } from 'material-react-table';
import { SimpleTable, UpdateButton } from '../../../components/common';

const Products: React.FC = () => {
  const productList = useAppSelector(state => state.products.products);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.customers.updateStatus);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return productList?.filter((product: ProductData) =>
      product.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [productList, filterName]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const handleUpdate = () => {
    dispatch(updateProducts());
  }

  const columns = useMemo<MRT_ColumnDef<ProductData, keyof ProductData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 350,
    },
    {
      accessorKey: 'unit',
      header: t('Unit'),
      size: 40,
    },
    {
      accessorKey: 'sku',
      header: t('SKU'),
      size: 40,
    },
    {
      accessorKey: 'categoryName',
      header: t('Category'),
      size: 40
    },
  ], [t]);

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <div className="flex justify-end mb-4">
        {/*
         <div className="flex items-center">
          <input
            type="text"
            placeholder={t('SearchByName')}
            value={filterName}
            onChange={handleFilterChange}
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
          />
        </div>
        */}

        <UpdateButton
          onClick={handleUpdate}
          updateStatus={updateStatus}
        />
      </div>
      {updateStatus === 'pending' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='error' />
        </Box>
      )}
      {filteredRows && !!filteredRows.length && (
        <SimpleTable
          columns={columns}
          rows={filteredRows}
          customRowHeight={54}
        />
      )}
    </div>
  );
}

export default Products;
