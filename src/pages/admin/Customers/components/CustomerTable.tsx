import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { CustomerData } from '../../../../api/types/customerData';
import { useCustomerColumns } from '../hooks/useCustomerColumns';

interface CustomersTableProps {
  items: CustomerData[];
}

const CustomersTable: React.FC<CustomersTableProps> = ({ items }) => {
  const columns = useCustomerColumns();

  return (
    <SimpleTable
      columns={columns}
      rows={items}
      customHeaderHeight={231}
      customRowHeight={93}
    />
  );
};

export default CustomersTable;