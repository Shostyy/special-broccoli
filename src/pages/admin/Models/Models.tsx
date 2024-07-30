import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useModels } from './hooks/useModels';
import ModelsTable from './components/ModelTable';
import { ModelData } from '../../../api/types/modelData';

const Models: React.FC = () => {
  const { models, updateStatus, handleUpdate, loading } = useModels();

  return (
    <HandbookPage<ModelData>
      items={models}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={ModelsTable}
    />
  );
};

export default Models;