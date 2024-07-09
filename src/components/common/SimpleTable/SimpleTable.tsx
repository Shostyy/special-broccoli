import React, { useMemo, useState, useEffect } from 'react';
import { MRT_ColumnDef, MRT_RowData, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '../../../theme/muiTheme';
import { TablePagination, Pagination } from '@mui/material';
import styled from '@emotion/styled';

const StyledPagination = styled(Pagination)`
  .MuiPagination-ul {
    justify-content: center;
  }
`;

interface SimpleTableProps<TData extends MRT_RowData> {
    columns: MRT_ColumnDef<TData, keyof TData>[];
    rows: TData[];
    footer?: React.ReactNode;
    enableFiltering?: boolean;
    enableFooter?: boolean;
    customRowHeight?: number;
    customHeaderHeight?: number;
    onRowClick?: (row: TData) => void;
    density?: 'compact' | 'comfortable';
}

const SimpleTable = <TData extends MRT_RowData>({
    columns,
    rows,
    footer,
    enableFiltering = true,
    enableFooter = false,
    customRowHeight = 54,
    customHeaderHeight = 172,
    onRowClick,
    density = 'comfortable'
}: SimpleTableProps<TData>) => {
    const { i18n } = useTranslation();
    const currentTableLocale = useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n.language]);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        const calculatePageSize = () => {
            const tableContainer = document.getElementById('tableContainer');
            if (tableContainer) {
                const height = tableContainer.clientHeight;
                const calculatedPageSize = Math.max(1, Math.floor((height - customHeaderHeight) / (customRowHeight)) - (enableFooter ? 1 : 0));
                setPageSize(calculatedPageSize);
            }
        };

        calculatePageSize();

        window.addEventListener('resize', calculatePageSize);

        return () => {
            window.removeEventListener('resize', calculatePageSize);
        };
    }, [customRowHeight, enableFooter]);

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#fff',
            }}
            className='rounded-2xl'
            id='tableContainer'
        >
            {rows && rows.length > 0 && (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ThemeProvider theme={muiTheme}>
                        <MaterialReactTable
                            columns={columns}
                            data={rows}
                            initialState={{
                                showColumnFilters: true,
                                density: density
                            }}
                            state={{
                                pagination: { pageSize, pageIndex },
                            }}
                            onPaginationChange={(updater) => {
                                if (typeof updater === 'function') {
                                    const newPagination = updater({ pageIndex, pageSize });
                                    setPageIndex(newPagination.pageIndex);
                                    setPageSize(newPagination.pageSize);
                                }
                            }}
                            localization={currentTableLocale}
                            muiTableBodyRowProps={({ row }) => ({
                                hover: true,
                                onClick: () => onRowClick && onRowClick(row.original),
                            })}
                            enableColumnResizing={false}
                            enablePagination={true}
                            enableColumnActions={false}
                            enableHiding={false}
                            enableFilters={enableFiltering}
                            enableCellActions={false}
                            enableStickyHeader
                            muiTableFooterRowProps={{
                                sx: { backgroundColor: 'lightgrey' }
                            }}
                            enableDensityToggle={false}
                            enableFullScreenToggle={false}
                            enableTableFooter={enableFooter}
                            enableBottomToolbar={true}
                            enableStickyFooter={false}
                            muiTableContainerProps={{
                                sx: { height: '100%' }
                            }}
                            paginationDisplayMode='pages'
                            muiTablePaperProps={{
                                elevation: 0,
                                sx: { boxShadow: 'none' }
                            }}
                            renderBottomToolbar={({ table }) => {
                                console.log(table);
                                return (
                                    <div className="pt-1 pb-1 flex h-full justify-center items-center">
                                        <StyledPagination
                                            count={table.getPageCount()}
                                            page={pageIndex + 1}
                                            onChange={(_, newPage) => {
                                                table.setPageIndex(newPage - 1);
                                            }}
                                            shape="rounded"
                                            showFirstButton
                                            showLastButton
                                        />
                                    </div>
                                )
                            }}
                        />
                    </ThemeProvider>
                </div>
            )}
        </div>
    );
};

export default SimpleTable;