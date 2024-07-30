import React from 'react';
import { useBranchOffices } from './hooks/useBranchOffices';
import BranchOfficesTable from './components/BranchOfficesTable';
import { HandbookPage } from '../../../components/common';
import { BranchOffice } from '../../../api/types/branchOffice';

const BranchOffices: React.FC = () => {
  const {
    branchOffices,
    updateStatus,
    handleUpdateClick,
    loading,
  } = useBranchOffices();

  return (
    <HandbookPage<BranchOffice>
      items={branchOffices}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdateClick}
      TableComponent={BranchOfficesTable}
    />
  );
};

export default BranchOffices;