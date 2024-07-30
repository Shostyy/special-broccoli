import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { ModelData } from '../../../../api/types/modelData';
import { useModelColumns } from '../hooks/useModelColumns';

interface ModelsTableProps {
  items: ModelData[];
}

const ModelsTable: React.FC<ModelsTableProps> = ({ items }) => {
  const columns = useModelColumns();

  return (
    <SimpleTable
      columns={columns}
      rows={items}
    />
  );
};

export default ModelsTable;