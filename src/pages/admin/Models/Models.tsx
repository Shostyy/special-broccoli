import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress } from '@mui/material';
import { ModelData } from '../../../api/types/modelData';
import { fetchModelsAsync, updateModels } from '../../../redux/slices/modelSlice';
import { MRT_ColumnDef } from 'material-react-table';
import { SimpleTable, UpdateButton } from '../../../components/common';

const Models: React.FC = () => {
  const modelsList = useAppSelector(state => state.models.models);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.models.updateStatus);

  useEffect(() => {
    dispatch(fetchModelsAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return modelsList?.filter((model: ModelData) =>
      model.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [modelsList, filterName]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const columns = useMemo<MRT_ColumnDef<ModelData, keyof ModelData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
    },
    {
      accessorKey: 'name',
      header: t('Name'),
    },
  ], [t]);

  const handleUpdate = () => {
    dispatch(updateModels());
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
        />
      )}

    </div>
  );
}

export default Models;
