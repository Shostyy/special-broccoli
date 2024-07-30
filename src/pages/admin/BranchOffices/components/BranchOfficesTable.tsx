import React from 'react';
import { useTranslation } from 'react-i18next';
import { BranchOffice } from '../../../../api/types/branchOffice';
import { SimpleTable } from '../../../../components/common';
import { useBranchOfficesColumns } from '../hooks/useBranchOfficesColumns';

interface BranchOfficesTableProps {
  items: BranchOffice[];
}

const BranchOfficesTable: React.FC<BranchOfficesTableProps> = ({
  items,
}) => {
  const columns = useBranchOfficesColumns();

  return (
    <SimpleTable
      columns={columns}
      rows={items}
      customRowHeight={54}
    />
  );
};

export default BranchOfficesTable;