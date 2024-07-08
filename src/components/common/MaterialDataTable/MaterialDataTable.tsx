import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { ukUA, enUS } from '@mui/x-data-grid/locales';
import { Box, LinearProgress } from '@mui/material';
import { fetchBranchOfficesAsync, updateBranchOffices } from '../../../redux/slices/branchOfficesSlice';
import { BranchOffice } from '../../../api/types/branchOffice';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';

const MaterialDataTable: React.FC = () => {
  const categoriesList = useAppSelector(state => state.branchOffices.branchOffices);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.categories.updateStatus);

  useEffect(() => {
    dispatch(fetchBranchOfficesAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return categoriesList?.filter((branchOffice: BranchOffice) =>
      branchOffice.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [categoriesList, filterName]);

  const currentLocale = useMemo(() => {
    return i18n.language === 'uk' ? ukUA.components.MuiDataGrid.defaultProps.localeText : enUS.components.MuiDataGrid.defaultProps.localeText;
  }, [i18n.language]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };


  const columns = useMemo<MRT_ColumnDef<BranchOffice, keyof BranchOffice>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
    },
    {
      accessorKey: 'name',
      header: t('Name'),
    },
  ], [t]);

  const handleUpdateClick = () => {
    dispatch(updateBranchOffices());
  };

  const currentTableLocale = useMemo(() => {
    return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
  }, [i18n]);

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder={t('SearchByName')}
            value={filterName}
            onChange={handleFilterChange}
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleUpdateClick}
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          {t('Upd')}
        </button>
      </div>
      {updateStatus === 'pending' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color='error' />
        </Box>
      )}
      {filteredRows && !!filteredRows.length && (
        <MaterialReactTable
          columns={columns}
          data={filteredRows}
          localization={currentTableLocale}
          muiTableBodyRowProps={{ hover: true }}
          enableColumnResizing={false}
          enablePagination
          enableFilters={false}
          enableCellActions={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
        />
      )}

    </div>
  );
}

export default MaterialDataTable;
