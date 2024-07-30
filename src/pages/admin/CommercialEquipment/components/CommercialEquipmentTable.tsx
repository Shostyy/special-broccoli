import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { CommercialEquipment } from '../../../../api/types/commercialEquipment';
import { useCommercialEquipmentColumns } from '../hooks/useCommercialEquipmentColumns';

interface CommercialEquipmentTableProps {
  items: CommercialEquipment[];
}

const CommercialEquipmentTable: React.FC<CommercialEquipmentTableProps> = ({
  items
}) => {
  const columns = useCommercialEquipmentColumns();

  return (
    <SimpleTable
      columns={columns}
      rows={items}
      customRowHeight={65}
    />
  );
};

export default CommercialEquipmentTable;