import React from 'react';
import { HandbookPage } from '../../../components/common';
import CommercialEquipmentTable from './components/CommercialEquipmentTable';
import { CommercialEquipment as CommercialEquipmentType } from '../../../api/types/commercialEquipment';
import { useCommercialEquipment } from './hooks/useCommercialEquipment';

const CommercialEquipment: React.FC = () => {
  const { 
    commercialEquipment, 
    updateStatus, 
    handleUpdate, 
    loading 
  } = useCommercialEquipment();

  return (
    <HandbookPage<CommercialEquipmentType>
      items={commercialEquipment}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={CommercialEquipmentTable}
    />
  );
};

export default CommercialEquipment;