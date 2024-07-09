import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { fetchAllConfigs, fetchCurrentConfig } from '../../../redux/slices/postConfigSlice';
import { Select, MenuItem, SelectChangeEvent, Checkbox, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { PostServerConfig } from '../../../api/types/postServerConfig';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import postServerApi from '../../../api/methods/postServerApi';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CreateIcon from '@mui/icons-material/Create';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ConfirmationModal } from '../Users/components/ConfirmationModal';
import { GeneralButton } from '../../../components/common';
import { appIcons } from '../../../data/constants/icons';
import { handleSetMessageTemporarily } from '../../../utils/handleSetMessageTemporarily';
import ErrorSuccessModal from '../Users/components/ErrorSuccessModal/ErrorSuccessModal';

const PostServer: React.FC = () => {
    const dispatch = useAppDispatch();
    const allConfigs = useAppSelector(state => state.postConfig.allConfigs);
    const currentConfig = useAppSelector(state => state.postConfig.currentConfig);
    const [editedRow, setEditedRow] = useState<PostServerConfig | null>(null);
    const [selectedConfig, setSelectedConfig] = useState<number>(currentConfig?.id || 0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openOptionsUserId, setOpenOptionsUserId] = useState<number | null>(null);
    const [configToDelete, setConfigToDelete] = useState<PostServerConfig | null>(null);
    const { t, i18n } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMassage, setSuccessMessage] = useState<string | null>(null);

    type YupValidationError = Yup.ValidationError;

    const [formValues, setFormValues] = useState<PostServerConfig>({
        id: 0,
        active: false,
        email: '',
        host: '',
        password: '',
        port: 0,
        useSSL: false,
    });

    const [formErrors, setFormErrors] = useState<{
        [key: string]: string;
    }>({});

    const validationSchema = Yup.object({
        email: Yup.string().email(t('InvalidEmail')).required(t('InvalidEmail')),
        host: Yup.string().required(t('TypeHost')),
        password: Yup.string().required(t('TypePw')),
        port: Yup.number(),
        useSSL: Yup.boolean(),
    });

    useEffect(() => {
        dispatch(fetchAllConfigs());
        dispatch(fetchCurrentConfig());
    }, [dispatch]);

    useEffect(() => {
        setSelectedConfig(currentConfig?.id || 0);
    }, [currentConfig]);

    const handleStartEditing = (config: PostServerConfig) => {
        setFormValues({
            id: config.id,
            active: config.active,
            email: config.email,
            host: config.host,
            password: config.password,
            port: config.port || 0,
            useSSL: config.useSSL,
        });
        setEditedRow(config);
    };

    const handleSaveChanges = () => {
        validationSchema.validate(formValues, { abortEarly: false })
            .then(() => {
                postServerApi.updateConfig(formValues)
                    .then(() => {
                        setFormValues({
                            id: 0,
                            active: false,
                            email: '',
                            host: '',
                            password: '',
                            port: 0,
                            useSSL: false,
                        });
                        setEditedRow(null);
                        dispatch(fetchAllConfigs());
                        dispatch(fetchCurrentConfig());

                        setSuccessMessage(t('GeneralSuccess'));

                        setTimeout(() => {
                            setSuccessMessage(null);
                        }, 2000);
                    })
                    .catch(() => {
                        setErrorMessage(t('GeneralError'));

                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 2000);
                    });
            })
            .catch((validationErrors: YupValidationError) => {
                const errors: { [key: string]: string } = {};

                validationErrors.inner.forEach((error: YupValidationError) => {
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });

                setFormErrors(errors);
            });
    };

    const prepareOneLineConfig = (config: PostServerConfig) => {
        return `#${config.id}. ${config.email}; ${config.host}; ${config.password}; ${config.port}; ${config.useSSL ? 'true' : 'false'}`;
    };

    const handleCancelDelete = () => {
        setConfigToDelete(null);
        setOpenDeleteDialog(false);
    }

    const handleUpdateCurrent = () => {
        if (selectedConfig !== currentConfig?.id) {
            postServerApi.updateCurrent(selectedConfig)
                .then(() => {
                    dispatch(fetchCurrentConfig());
                    dispatch(fetchAllConfigs());
                    setSuccessMessage(t('GeneralSuccess'));

                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Error updating current config:', error);

                    setErrorMessage(t('GeneralError'));

                    setTimeout(() => {
                        setErrorMessage('');
                    }, 4000);
                });
        }
    }

    const handleChange = (event: SelectChangeEvent<number>) => {
        const newValue = event.target.value as number;
        setSelectedConfig(newValue);
    };

    const handleAddConfig = async () => {
        try {
            const createdConfigId = await postServerApi.createConfig();
            dispatch(fetchAllConfigs());

            const newConfig = {
                id: createdConfigId,
                active: false,
                email: '',
                host: '',
                password: '',
                port: 0,
                useSSL: false,
            };

            setFormValues(newConfig);
            handleStartEditing(newConfig);

        } catch (error) {
            console.error('Error adding config:', error);
        }
    };

    const handleDelete = () => {
        if (configToDelete) {
            postServerApi.deleteConfig(configToDelete.id)
                .then(() => {
                    dispatch(fetchAllConfigs());
                    setEditedRow(null);

                    setSuccessMessage(t('GeneralSuccess'));

                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 2000);
                })
                .catch((error) => {
                    setErrorMessage(t('GeneralError'));

                    setTimeout(() => {
                        setErrorMessage('');
                    }, 4000);
                });
        }
        setOpenDeleteDialog(false);
    };

    const handleCancelEditing = () => {
        setEditedRow(null);
        setSelectedConfig(currentConfig?.id || 0);
    };

    const handleOpenOptions = (configId: number) => {
        setOpenOptionsUserId(configId);
    };

    const columns = useMemo<MRT_ColumnDef<PostServerConfig>[]>(() => [
        {
            accessorKey: 'id',
            size: 40,
            header: t('ID'),
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
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
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
                    <div className="flex justify-start gap-2">
                        <button
                            onClick={handleSaveChanges}
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
                            onClick={handleCancelEditing}
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
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        {openOptionsUserId === row.original.id ? (
                            <>
                                <button
                                    onClick={() => handleStartEditing(row.original)}
                                    className="text-gray-500 p-1 rounded"
                                >
                                    <CreateIcon />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenDeleteDialog(true);
                                        setConfigToDelete(row.original);

                                    }}
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
                    </div>
                )
            ),
        },
    ], [formValues, editedRow, openOptionsUserId]);

    const currentTableLocale = useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <>
            <div className="mb-6">
                <label htmlFor='active-set' className='mb-2 block'>{t('ActiveSet')}</label>
                <div className="flex justify-between">
                    <Select
                        value={selectedConfig}
                        onChange={handleChange}
                        id='active-set'
                        className='mb-2 w-1/2'
                        sx={{ zIndex: 10, bgcolor: '#fff' }}
                    >
                        {allConfigs?.map((config) => (
                            <MenuItem key={config.id} value={config.id}>
                                {prepareOneLineConfig(config)}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className='flex gap-8'>
                        <GeneralButton
                            onClick={handleUpdateCurrent}
                            translationKey='Save'
                        />
                        <GeneralButton
                            onClick={handleAddConfig}
                            icon={appIcons.addRed}
                            translationKey='Add'
                        />
                    </div>

                </div>
            </div>
            <div>
                {allConfigs && (
                    <MaterialReactTable
                        columns={columns}
                        data={allConfigs}
                        localization={currentTableLocale}
                        enablePagination={false}
                        muiTableBodyRowProps={{ hover: true }}
                        enableColumnResizing={false}
                        enableColumnActions={false}
                        enableHiding={false}
                        enableFilters={false}
                        enableCellActions={false}
                        enableDensityToggle={false}
                        enableFullScreenToggle={false}
                        enableTableFooter={false}
                    />
                )}

            </div>
            {openDeleteDialog && (
                <ConfirmationModal
                    message={`${t('Delete')}?`}
                    onConfirm={handleDelete}
                    onCancel={handleCancelDelete}
                />
            )}
            {errorMessage && (
                <ErrorSuccessModal
                    messageType='error'
                    message={errorMessage}
                />
            )}
            {successMassage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={successMassage}
                />
            )}
        </>
    );
};

export default PostServer;
