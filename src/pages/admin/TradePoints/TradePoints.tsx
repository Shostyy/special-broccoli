import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchTradePointAsync, updateTradePoints } from '../../../redux/slices/tradePointsSlice';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress, Tooltip } from '@mui/material';
import { TradePointData } from '../../../api/types/tradePointData';
import { MRT_ColumnDef } from 'material-react-table';
import { SimpleTable, UpdateButton } from '../../../components/common';

const TradePoints: React.FC = () => {
  const tradePointsList = useAppSelector(state => state.tradePoints.tradePoints);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.tradePoints.updateStatus);

  useEffect(() => {
    dispatch(fetchTradePointAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return tradePointsList?.filter((tradePoint: TradePointData) =>
      tradePoint.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [tradePointsList, filterName]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const columns = useMemo<MRT_ColumnDef<TradePointData, keyof TradePointData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
      grow: 0,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 100,
    },
    {
      accessorKey: 'address',
      header: t('Address'),
      size: 400,
      Cell: ({ cell }) => {
        const { address } = cell.row.original;

        const formatAddress = (address: string) => {
          if (address && address.length > 120) {
            return `${address.substring(0, 120)}...`;
            return address;
          }
          return address;
        };

        return (
          <Tooltip title={address} arrow disableHoverListener={address.length <= 75}>
            <div style={{height: '40px'}}>
              <span className="overflow-hidden h-10">{formatAddress(address)}</span>
            </div>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'branchOfficeName',
      header: t('BranchOffice'),
      size: 40,
    },
    {
      accessorKey: 'customerName',
      header: t('Customer'),
      size: 40,
    },
  ], [t]);

  const handleUpdate = () => {
    dispatch(updateTradePoints());
  };

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <div className="flex justify-end mb-4">
        {/*
        <div className="flex items-center">
          <input
            type="text"
            placeholder={t('SearchByName')}
            value={filterName}
            onChange={handleFilterChange}
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
          />
        </div>
        */}
        
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
          customRowHeight={73}
        />
      )}

    </div>
  );
}

export default TradePoints;
