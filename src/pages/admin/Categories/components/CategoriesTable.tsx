import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { CategoryData } from '../../../../api/types/categoryData';
import { useCategoryColumns } from '../hooks/useCategoriesColumns';

interface CategoriesTableProps {
  items: CategoryData[];
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ items }) => {
  const columns = useCategoryColumns();

  return (
    <SimpleTable
      columns={columns}
      rows={items}
      customRowHeight={56}
    />
  );
};

export default CategoriesTable;