import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useMaterials } from './hooks/useMaterials';
import MaterialsTable from './components/MaterialsTable';
import { MaterialData } from '../../../api/types/materialData';

const Materials: React.FC = () => {
  const { materials, updateStatus, handleUpdate, loading } = useMaterials();

  return (
    <HandbookPage<MaterialData>
      items={materials}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={MaterialsTable}
    />
  );
};

export default Materials;