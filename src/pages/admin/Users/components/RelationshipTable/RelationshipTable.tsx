import React, { useState, useEffect, useMemo } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../types/hooks';
import { UserRelationshipInfo } from '../../../../../api/types/userRelationshipInfo';
import { useTranslation } from 'react-i18next';
import { fetchUsersRelationshipAsync, setSelectedUserRelationship } from '../../../../../redux/slices/usersRelationshipSlice';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationModal } from '../ConfirmationModal';
import relationshipApi from '../../../../../api/methods/relationshipApi';

const RelationshipTable: React.FC = () => {
    const usersRelationship = useAppSelector(state => state.relationships.usersRelationshipInfo);
    const selectedUserRelationship = useAppSelector(state => state.relationships.selectedUsedRelationship);
    const [userLoginFilter, setUserLoginFilter] = useState<string>('');
    const [customerNameFilter, setCustomerNameFilter] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<UserRelationshipInfo[] | null>([]);
    const isLoading = useAppSelector(state => state.relationships.loading);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [relationshipToDelete, setRelationshipToDelete] = useState<UserRelationshipInfo | null>(null);

    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setRelationshipToDelete(null);
    };

    const handleDeleteRelationship = () => {
        if (relationshipToDelete) {
            relationshipApi.deleteRelationship(relationshipToDelete)
                .then(() => {
                    dispatch(setSelectedUserRelationship(null));
                    dispatch(fetchUsersRelationshipAsync());

                    setSuccessMessage(t('RelationshipDelSuccess'));
                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 1500);
                })
                .catch(() => {
                    setErrorMessage(t('GeneralError'));
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 2500);
                })
                .finally(() => {
                    setDeleteDialogOpen(false);
                })
        }
    }

    useEffect(() => {
        const filtered = usersRelationship?.filter(user => (
            user.userLogin.toLowerCase().includes(userLoginFilter.toLowerCase()) &&
            user.customerName.toLowerCase().includes(customerNameFilter.toLowerCase())
        ));

        setFilteredUsers(filtered || null);
    }, [usersRelationship, userLoginFilter, customerNameFilter]);

    const handleUserLoginFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserLoginFilter(event.target.value);
    };

    const handleCustomerNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerNameFilter(event.target.value);
    };

    const columns: MRT_ColumnDef<UserRelationshipInfo, keyof UserRelationshipInfo>[] = [
        {
            accessorKey: 'userLogin',
            header: t('UserLogin'),
            Cell: ({ row }) => <div>{row.original.userLogin}</div>,
        },
        {
            accessorKey: 'customerName',
            header: t('CustomerName'),
            Cell: ({ row }) => <div>{row.original.customerName}</div>,
        },
        {
            accessorKey: 'actions',
            header: t('Actions'),
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setRelationshipToDelete(row.original)
                            handleDeleteClick();
                        }}
                        className="text-gray-500 p-1 rounded"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ),
        },
    ];

    const currentTableLocale = useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n.language]);

    return (
        <>
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    value={userLoginFilter}
                    onChange={handleUserLoginFilterChange}
                    placeholder={t('UserLogin')}
                    className="bg-white border border-gray-300 mb-2 py-2 px-4 block w-72 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    style={{ height: '50px' }}
                />
                <input
                    type="text"
                    value={customerNameFilter}
                    onChange={handleCustomerNameFilterChange}
                    placeholder={t('CustomerName')}
                    className="bg-white border border-gray-300 mb-2 py-2 px-4 block w-72 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    style={{ height: '50px' }}
                />
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-300">
                <MaterialReactTable
                    columns={columns}
                    data={filteredUsers || []}
                    localization={currentTableLocale}
                    enablePagination={true}
                    initialState={{
                        pagination: { pageSize: 7, pageIndex: 0 },
                    }}
                    paginationDisplayMode='pages'
                    muiPaginationProps={{
                        showRowsPerPage: false,
                        shape: 'rounded',
                        variant: 'outlined',
                        showFirstButton: false,
                        showLastButton: false,
                    }}
                    enableColumnResizing={false}
                    enableColumnActions={false}
                    enableHiding={false}
                    enableFilters={false}
                    enableCellActions={false}
                    enableDensityToggle={false}
                    enableFullScreenToggle={false}
                />
            </div>
            {isLoading && (
                <div className="text-center mt-4">
                    <CircularProgress />
                </div>
            )}
            {isDeleteDialogOpen && (
                <ConfirmationModal
                    message='OneRelationshipDelMessage'
                    onConfirm={handleDeleteRelationship}
                    onCancel={handleDeleteDialogClose}
                />
            )}
        </>
    );
}

export default RelationshipTable;
