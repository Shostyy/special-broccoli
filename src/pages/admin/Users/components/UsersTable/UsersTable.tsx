import React, { useEffect, useMemo, useState } from 'react';
import { fetchUsersAsync } from '../../../../../redux/slices/usersSlice';
import { UserInfo } from '../../../../../api/types/userInfo';
import { useTranslation } from 'react-i18next';
import { fetchAllRoles } from '../../../../../redux/slices/registerNewUserSlice';
import { useAppDispatch, useAppSelector } from '../../../../../types/hooks';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import editUserApi from '../../../../../api/methods/editUserApi';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import { ConfirmationModal } from '../ConfirmationModal';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ADMIN_ROLE } from '../../../../../data/constants/constants';

const UsersTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.users.usersInfo);
    const allRoles = useAppSelector(state => state.register.allRoles);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<UserInfo> | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openOptionsUserId, setOpenOptionsUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [error, setError] = useState<string | null>(null); // State to manage error state

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true); // Start loading
        setError(null); // Clear any previous errors

        Promise.all([
            dispatch(fetchUsersAsync()),
            dispatch(fetchAllRoles())
        ]).then(() => {
            setLoading(false); // Stop loading when data fetching is done
        }).catch((err) => {
            setError('Failed to fetch data.'); // Set error state if fetching fails
            setLoading(false); // Stop loading on error
        });
    }, [dispatch]);

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered ? filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm) ||
                user.login.toLowerCase().includes(searchTerm)
            ) : [];
        }

        return filtered;
    }, [searchTerm, users]);

    const handleSaveUser = async () => {
        if (editedUser) {
            editUserApi.editUser(editedUser)
                .then(() => {
                    dispatch(fetchUsersAsync());
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.status);
                })
                .finally(() => {
                    setEditingUserId(null);
                    setEditedUser(null);
                    setOpenOptionsUserId(null);
                });
        }
    };

    const handleToggleUserBlock = async (user: UserInfo) => {
        try {
            await editUserApi.toggleUserBlock(user);
            dispatch(fetchUsersAsync());
        } catch (error) {
            console.error('Failed to toggle user block:', error);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setDeleteUserId(userId);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (deleteUserId !== null) {
            editUserApi.deleteUser(deleteUserId)
                .then(() => {
                    setOpenDeleteModal(false);
                })
                .catch(() => {
                    console.error('Failed to delete user');
                })
                .finally(() => {
                    dispatch(fetchUsersAsync());
                    setDeleteUserId(null);
                })

        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteModal(false);
        setDeleteUserId(null);
        setOpenOptionsUserId(null);
    };

    const startEditing = (userId: number) => {
        setEditingUserId(userId);
        const userToEdit = filteredUsers?.find((user: UserInfo) => user.id === userId);
        if (userToEdit) {
            setEditedUser({ ...userToEdit });
        }
    };

    const stopEditing = () => {
        setEditingUserId(null);
        setEditedUser(null);
        setOpenOptionsUserId(null);
    };

    const handleOpenOptions = (userId: number) => {
        setOpenOptionsUserId(userId === openOptionsUserId ? null : userId);
    };

    const columns = useMemo<MRT_ColumnDef<UserInfo, keyof UserInfo>[]>(() => [
        {
            accessorKey: 'login',
            header: t('Login'),
            Cell: ({ row }) => (
                editingUserId === row.original.id ? (
                    <input
                        type="text"
                        value={editedUser?.login || ''}
                        onChange={(e) => {
                            const updatedUser = { ...editedUser, login: e.target.value };
                            setEditedUser(updatedUser);
                        }}
                        className="border rounded p-1"
                    />
                ) : (
                    row.original.login
                )
            ),
        },
        {
            accessorKey: 'email',
            header: t('Email'),
            Cell: ({ row }) => (
                editingUserId === row.original.id ? (
                    <input
                        type="text"
                        value={editedUser?.email || ''}
                        onChange={(e) => {
                            const updatedUser = { ...editedUser, email: e.target.value };
                            setEditedUser(updatedUser);
                        }}
                        className="border rounded p-1 w-72"
                    />
                ) : (
                    row.original.email
                )
            ),
        },
        {
            accessorKey: 'role',
            header: t('Role'),
            Cell: ({ row }) => (
                editingUserId === row.original.id ? (
                    <select
                        value={editedUser?.role?.id || ''}
                        onChange={(e) => {
                            const selectedRole = allRoles?.find(role => role.id === Number(e.target.value));
                            const updatedUser = { ...editedUser, role: selectedRole };
                            setEditedUser(updatedUser);
                        }}
                        className="border rounded p-1 w-48"
                    >
                        {allRoles?.map(role => (
                            <option key={role.id} value={role.id}>
                                {t(role.name)}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="flex gap-3">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: `${row.original.role && row.original.role.name === ADMIN_ROLE ? '#3C3E6B' : '#DAE1EC'}`
                        }}></div><span>{row.original.role ? t(row.original.role.name) : '-'}</span>
                    </div>
                )
            ),
        },
        {
            accessorKey: 'blocked',
            header: t('Blocked'),
            Cell: ({ row }) => (
                <span>{row.original.blocked ? 'true' : 'false'}</span>
            ),
        },
        {
            accessorKey: 'actions',
            header: t('Actions'),
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    {editingUserId === row.original.id ? (
                        <>
                            <button
                                onClick={handleSaveUser}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #C25458',
                                    alignItems: 'center',
                                    borderRadius: '5px',
                                    padding: '3px',
                                    width: '80px',
                                    color: '#C25458'
                                }}
                            >
                                <CheckCircleOutlineIcon htmlColor='#C25458' />
                                {t('Save')}
                            </button>
                            <button
                                onClick={stopEditing}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #000',
                                    alignItems: 'center',
                                    borderRadius: '5px',
                                    padding: '3px',
                                    width: '80px',
                                    color: '#000'
                                }}
                            >
                                <HighlightOffIcon />
                                {t('Cancel')}
                            </button>
                        </>
                    ) : (
                        <>
                            {openOptionsUserId === row.original.id ? (
                                <>
                                    <button
                                        onClick={() => startEditing(row.original.id)}
                                        className="text-gray-500 p-1 rounded"
                                    >
                                        <CreateIcon />
                                    </button>
                                    <button
                                        onClick={() => handleToggleUserBlock(row.original)}
                                        className={`text-gray-500 p-1 rounded`}
                                    >
                                        {<BlockIcon titleAccess={row.original.blocked ? t('Unblock') : t('Block')} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(row.original.id)}
                                        className="text-gray-500 p-1 rounded"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleOpenOptions(row.original.id)}
                                    className="text-gray-500 p-1 rounded"
                                >
                                    <MoreHorizIcon />
                                </button>
                            )}
                        </>
                    )}
                </div>
            ),
        },

    ], [t, editingUserId, editedUser, openOptionsUserId]);


    const currentTableLocale = useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n.language]);

    // Display loading state while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error message if fetching data fails
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render table if data is loaded and exists
    return (
        <>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder={t('SearchByLoginOrEmail')}
                className="bg-white border border-gray-300 mb-6 py-2 px-4 block w-2/3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                style={{ height: '50px' }}
            />
            {filteredUsers && filteredUsers.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-gray-300">
                    <MaterialReactTable
                        columns={columns}
                        data={filteredUsers}
                        localization={currentTableLocale}
                        enablePagination={true}
                        initialState={{
                            pagination: { pageSize: 8, pageIndex: 0 }
                        }}
                        paginationDisplayMode='pages'
                        muiPaginationProps={{
                            showRowsPerPage: false,
                            shape: "rounded",
                            variant: "outlined",
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
                    {openDeleteModal && (
                        <ConfirmationModal
                            message={t('RelationshipDelMessage')}
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default UsersTable;
