// src/hooks/usePostServer.ts
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../types/hooks';
import { PostServerConfig } from '../../../../api/types/postServerConfig';
import { fetchAllConfigs, fetchCurrentConfig } from '../../../../redux/slices/postConfigSlice';
import postServerApi from '../../../../api/methods/postServerApi';

export const usePostServer = () => {
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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            .catch((validationErrors: Yup.ValidationError) => {
                const errors: { [key: string]: string } = {};

                validationErrors.inner.forEach((error: Yup.ValidationError) => {
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

    const currentTableLocale = useMemo(() => {
        return i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;
    }, [i18n]);

    return {
        allConfigs,
        currentConfig,
        editedRow,
        selectedConfig,
        openDeleteDialog,
        openOptionsUserId,
        configToDelete,
        errorMessage,
        successMessage,
        formValues,
        formErrors,
        currentTableLocale,
        handleStartEditing,
        handleSaveChanges,
        prepareOneLineConfig,
        handleCancelDelete,
        handleUpdateCurrent,
        handleChange,
        handleAddConfig,
        handleDelete,
        handleCancelEditing,
        handleOpenOptions,
        handleInputChange,
        handleCheckboxChange,
        setOpenDeleteDialog,
        setConfigToDelete,
    };
};