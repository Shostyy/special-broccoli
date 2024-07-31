// src/components/PostServer/useTableColumns.ts
import React, { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { Checkbox, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from '../styles/PostServer.module.css';
import { PostServerConfig } from '../../../../api/types/postServerConfig';

interface UseTableColumnsProps {
    t: (key: string) => string;
    editedRow: PostServerConfig | null;
    formValues: PostServerConfig;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleStartEditing: (config: PostServerConfig) => void;
    handleSaveChanges: () => void;
    handleCancelEditing: () => void;
    handleOpenOptions: (configId: number) => void;
    setOpenDeleteDialog: (open: boolean) => void;
    setConfigToDelete: (config: PostServerConfig) => void;
    openOptionsUserId: number | null;
}

export const useTableColumns = ({
    t,
    editedRow,
    formValues,
    handleInputChange,
    handleCheckboxChange,
    handleStartEditing,
    handleSaveChanges,
    handleCancelEditing,
    handleOpenOptions,
    setOpenDeleteDialog,
    setConfigToDelete,
    openOptionsUserId
}: UseTableColumnsProps): MRT_ColumnDef<PostServerConfig>[] => {
    return useMemo(() => [
        {
            accessorKey: 'id',
            header: t('ID'),
            size: 40,
            enableEditing: false,
        },
        {
            accessorKey: 'active',
            header: t('Active'),
            size: 20,
            enableEditing: false,
            Cell: ({ cell }) => (
                <>{cell.row.original.active ? t('Yes') : t('No')}</>
            ),
        },
        {
            accessorKey: 'email',
            header: t('Email'),
            Cell: ({ cell }) => (
                editedRow?.id === cell.row.original.id
                    ? <input
                        type="text"
                        value={formValues.email}
                        onChange={handleInputChange}
                        name="email"
                        className={styles.formInput}
                    />
                    : <>{cell.row.original.email}</>
            ),
        },
        {
            accessorKey: 'host',
            header: t('Host'),
            Cell: ({ cell }) => (
                editedRow?.id === cell.row.original.id
                    ? <input
                        type="text"
                        value={formValues.host}
                        onChange={handleInputChange}
                        name="host"
                        className={styles.formInput}
                    />
                    : <>{cell.row.original.host}</>
            ),
        },
        {
            accessorKey: 'password',
            header: t('Password'),
            Cell: ({ cell }) => (
                editedRow?.id === cell.row.original.id
                    ? <input
                        type="text"
                        value={formValues.password}
                        onChange={handleInputChange}
                        name="password"
                        className={styles.formInput}
                    />
                    : <>{cell.row.original.password}</>
            ),
        },
        {
            accessorKey: 'port',
            header: t('Port'),
            size: 40,
            Cell: ({ cell }) => (
                editedRow?.id === cell.row.original.id
                    ? <input
                        type="number"
                        value={formValues.port}
                        onChange={handleInputChange}
                        name="port"
                        className={styles.formInput}
                    />
                    : <>{cell.row.original.port}</>
            ),
        },
        {
            accessorKey: 'useSSL',
            header: t('SSL'),
            size: 20,
            Cell: ({ cell }) => (
                editedRow?.id === cell.row.original.id
                    ? <Checkbox
                        checked={formValues.useSSL}
                        onChange={handleCheckboxChange}
                        name="useSSL"
                    />
                    : <Checkbox
                        checked={cell.row.original.useSSL}
                        disabled={true}
                    />
            ),
        },
        {
            header: t('Actions'),
            id: 'actions',
            size: 200,
            Cell: ({ row }) => (
                editedRow?.id === row.original.id ? (
                    <div className={styles.actionButtonsContainer}>
                        <button
                            onClick={handleSaveChanges}
                            className={styles.saveButton}
                        >
                            <CheckCircleOutlineIcon className={styles.buttonIcon} />
                            {t('Save')}
                        </button>
                        <button
                            onClick={handleCancelEditing}
                            className={styles.cancelButton}
                        >
                            <HighlightOffIcon className={styles.buttonIcon} />
                            {t('Cancel')}
                        </button>
                    </div>
                ) : (
                    <div className={styles.actionIconsContainer}>
                        {openOptionsUserId === row.original.id ? (
                            <>
                                <IconButton
                                    onClick={() => handleStartEditing(row.original)}
                                    className={styles.actionIcon}
                                >
                                    <CreateIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        setOpenDeleteDialog(true);
                                        setConfigToDelete(row.original);
                                    }}
                                    className={styles.actionIcon}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton
                                onClick={() => handleOpenOptions(row.original.id)}
                                className={styles.actionIcon}
                            >
                                <MoreHorizIcon />
                            </IconButton>
                        )}
                    </div>
                )
            ),
        },
    ], [t, editedRow, formValues, handleInputChange, handleCheckboxChange, handleStartEditing, handleSaveChanges, handleCancelEditing, handleOpenOptions, setOpenDeleteDialog, setConfigToDelete, openOptionsUserId]);
};