import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress } from '@mui/material';
import { fetchBranchOfficesAsync, updateBranchOffices } from '../../../redux/slices/branchOfficesSlice';
import { BranchOffice } from '../../../api/types/branchOffice';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { SimpleTable, UpdateButton } from '../../../components/common';

const BranchOffices: React.FC = () => {
  const branchOffices = useAppSelector(state => state.branchOffices.branchOffices);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const updateStatus = useAppSelector(state => state.categories.updateStatus);

  useEffect(() => {
    dispatch(fetchBranchOfficesAsync());
  }, [dispatch]);

  const columns = useMemo<MRT_ColumnDef<BranchOffice, keyof BranchOffice>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      filterFn: 'includesString'
    },
  ], [t]);

  const handleUpdateClick = () => {
    dispatch(updateBranchOffices());
  };

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <div className="flex justify-end mb-4">
        <UpdateButton
          onClick={handleUpdateClick}
          updateStatus={updateStatus}
        />
      </div>
      {updateStatus === 'pending' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='error' />
        </Box>
      )}
      {branchOffices && !!branchOffices.length && (
        <SimpleTable
          columns={columns}
          rows={branchOffices}
          customRowHeight={54}
        />
      )}

    </div>
  );
}

export default BranchOffices;
