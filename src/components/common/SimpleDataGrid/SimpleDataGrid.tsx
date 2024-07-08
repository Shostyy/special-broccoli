import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridLocaleText } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { ukUA, enUS } from '@mui/x-data-grid/locales';

interface SimpleTableProps {
    columns: GridColDef[];
    rows: GridRowsProp;
    enableFiltering?: boolean;
    enableFooter?: boolean;
}

const SimpleDataGrid: React.FC<SimpleTableProps> = ({ 
    columns, 
    rows, 
    enableFiltering = true, 
    enableFooter = false 
}) => {
    const { i18n } = useTranslation();

    const currentTableLocale = useMemo((): Partial<GridLocaleText> => {
        return i18n.language === 'uk' ? ukUA.components.MuiDataGrid.defaultProps.localeText : enUS.components.MuiDataGrid.defaultProps.localeText;
    }, [i18n.language]);

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-300 pb-2 mb-2 bg-white" style={{ height: 400, width: '100%' }}>
            {rows && rows.length > 0 && (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={currentTableLocale}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableDensitySelector
                    disableColumnSelector
                    filterMode={enableFiltering ? 'server' : undefined}
                    sx={{
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        '& .MuiDataGrid-footer': {
                            backgroundColor: 'lightgrey',
                        },
                    }}
                    autoPageSize={true}
                />
            )}
        </div>
    );
};

export default SimpleDataGrid;