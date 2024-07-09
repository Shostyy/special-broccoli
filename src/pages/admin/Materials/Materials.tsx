import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { ukUA, enUS } from '@mui/x-data-grid/locales';
import { Box, LinearProgress } from '@mui/material';
import { MaterialData } from '../../../api/types/materialData';
import { fetchMaterialsAsync, updateMaterials } from '../../../redux/slices/materialsSlice';
import { SimpleTable, UpdateButton } from '../../../components/common';
import { MRT_ColumnDef } from 'material-react-table';

const Materials: React.FC = () => {
  const materialsList = useAppSelector(state => state.materials.materials);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.materials.updateStatus);

  useEffect(() => {
    dispatch(fetchMaterialsAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return materialsList?.filter((material: MaterialData) =>
      material.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [materialsList, filterName]);

  const currentLocale = useMemo(() => {
    return i18n.language === 'uk' ? ukUA.components.MuiDataGrid.defaultProps.localeText : enUS.components.MuiDataGrid.defaultProps.localeText;
  }, [i18n.language]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const columns = useMemo<MRT_ColumnDef<MaterialData, keyof MaterialData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 350,
    },
    {
      accessorKey: 'unit',
      header: t('Unit'),
      size: 40,
    },
    {
      accessorKey: 'weighty',
      header: t('Weighty'),
      Cell: ({ cell }) => (
        cell.row.original.weighty ? t('Yes') : t('No')
      ),
      size: 40,
    },

  ], [t]);


  const handleUpdate = () => {
    dispatch(updateMaterials());
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
          customRowHeight={54}
        />
      )}

    </div>
  );
}

export default Materials;
