import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchCustomersAsync, updateCustomers } from '../../../redux/slices/customersSlice';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, LinearProgress, Tooltip } from '@mui/material';
import { CustomerData } from '../../../api/types/customerData';
import { MRT_ColumnDef } from 'material-react-table';
import { SimpleTable, UpdateButton } from '../../../components/common';

const Customers: React.FC = () => {
  const customerList = useAppSelector(state => state.customers.customers);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.customers.updateStatus);

  useEffect(() => {
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return customerList?.filter((customer: CustomerData) =>
      customer.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [customerList, filterName]);

  const handleUpdate = () => {
    dispatch(updateCustomers());
  }

  const columns = useMemo<MRT_ColumnDef<CustomerData, keyof CustomerData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      filterFn: 'equals',
      size: 40,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      filterFn: 'includesString',
      Cell: ({ cell }) => <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}><span>{cell.row.original.name}</span></div>
    },
    {
      accessorKey: 'phones',
      header: t('Phones'),
      filterFn: 'includesString',
      size: 40
    },
    {
      accessorKey: 'emails',
      header: t('Email'),
      filterFn: 'includesString',
      size: 160,
    },
    {
      accessorKey: 'addresses',
      header: t('Addresses'),
      size: 350,
      filterFn: 'contains',
      Cell: ({ cell }) => {
        const { addresses } = cell.row.original;

        const formatAddress = (addresses: string) => {
          if (addresses && addresses.length > 100) {
            return `${addresses.substring(0, 100)}...`;
            return addresses;
          }
          return addresses;
        };

        return (
          <Tooltip title={addresses} arrow disableHoverListener={addresses.length <= 75}>
            <div>
              <span className="overflow-hidden h-10">{formatAddress(addresses)}</span>
            </div>
          </Tooltip>
        );
      },
    },
  ], [t]);

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <div className="flex justify-end mb-4">
        <UpdateButton
          onClick={handleUpdate}
          updateStatus={updateStatus}
        />
      </div>
      {updateStatus === 'pending' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='error' />
        </Box>
      )}
      {filteredRows && !!filteredRows.length && (
        <SimpleTable
          columns={columns}
          rows={filteredRows}
          customHeaderHeight={231}
          customRowHeight={93}
        />
      )}
      {(!filteredRows || filteredRows.length === 0) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default Customers;
