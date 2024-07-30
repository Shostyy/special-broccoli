import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useCustomers } from './hooks/useCustomers';
import { CustomerData } from '../../../api/types/customerData';
import CustomersTable from './components/CustomerTable';

const Customers: React.FC = () => {
  const { customers, updateStatus, handleUpdate, loading } = useCustomers();

  return (
    <HandbookPage<CustomerData>
      items={customers}
      loading={loading}
      updateStatus={updateStatus}
      handleUpdate={handleUpdate}
      TableComponent={CustomersTable}
    />
  );
};

export default Customers;