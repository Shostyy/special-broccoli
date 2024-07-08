import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress } from '@mui/material';
import { CategoryData } from '../../../api/types/categoryData';
import { fetchCategoriesAsync, updateCategories } from '../../../redux/slices/categoriesSlice';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { SimpleTable, UpdateButton } from '../../../components/common';

const Categories: React.FC = () => {
  const categoriesList = useAppSelector(state => state.categories.categories);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [filterName, setFilterName] = useState<string>('');
  const updateStatus = useAppSelector(state => state.categories.updateStatus);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return categoriesList?.filter((category: CategoryData) =>
      category.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [categoriesList, filterName]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const currentTableLocale = useMemo(() => {
    return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
  }, [i18n.language]);


  const columns = useMemo<MRT_ColumnDef<CategoryData, keyof CategoryData>[]>(() => [
    {
      accessorKey: 'id',
      header: t('ID'),
      size: 40,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
    },
  ], [t]);

  const handleUpdate = () => {
    dispatch(updateCategories());
  };

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
          customRowHeight={56}
        />
      )}

    </div>
  );
}

export default Categories;
