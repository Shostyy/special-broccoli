import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface TablePaginationProps {
    pageIndex: number;
    pageSize: number;
    totalItemCount: number;
    onPageChange: (pageIndex: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    pageIndex,
    pageSize,
    totalItemCount,
    onPageChange,
}) => {
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value - 1); // Material-UI Pagination starts from 1, but our state starts from 0
    };

    return (
        <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" mt={2}>
            <Pagination
                count={Math.ceil(totalItemCount / pageSize)}
                page={pageIndex + 1} // Material-UI Pagination starts from 1, but our state starts from 0
                onChange={handlePageChange}
                shape="rounded"
                variant="outlined"
                showFirstButton
                showLastButton
            />
        </Stack>
    );
};

export default TablePagination;
