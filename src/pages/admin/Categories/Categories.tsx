import React from 'react';
import { useCategories } from './hooks/useCategories';
import CategoriesTable from './components/CategoriesTable';
import { HandbookPage } from '../../../components/common';
import { CategoryData } from '../../../api/types/categoryData';

const Categories: React.FC = () => {
  const {
    categories,
    updateStatus,
    handleUpdate,
    loading,
  } = useCategories();

  return (
    <HandbookPage<CategoryData>
      items={categories}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={CategoriesTable}
    />
  );
};

export default Categories;