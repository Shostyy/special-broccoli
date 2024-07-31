import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { ConfirmationModal } from '../Users/components/ConfirmationModal';
import ErrorSuccessModal from '../Users/components/ErrorSuccessModal/ErrorSuccessModal';
import { useTranslation } from 'react-i18next';
import styles from './styles/PostServer.module.css';
import { GeneralButton } from '../../../components/common';
import { appIcons } from '../../../data/constants/icons';
import { usePostServer } from './hooks/usePostServer';
import { useTableColumns } from './hooks/useTableColumns';

const PostServer: React.FC = () => {
    const { t } = useTranslation();
    const {
        allConfigs,
        selectedConfig,
        openDeleteDialog,
        errorMessage,
        successMessage,
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
        editedRow,
        formValues,
        openOptionsUserId,
    } = usePostServer();

    const columns = useTableColumns({
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
        openOptionsUserId,
    });

    return (
        <>
            <div className={styles.selectContainer}>
                <label htmlFor='active-set' className={styles.label}>{t('ActiveSet')}</label>
                <div className={styles.selectWrapper}>
                    <Select
                        value={selectedConfig}
                        onChange={handleChange}
                        id='active-set'
                        className={styles.select}
                    >
                        {allConfigs?.map((config) => (
                            <MenuItem key={config.id} value={config.id}>
                                {prepareOneLineConfig(config)}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className={styles.buttonContainer}>
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
            <div className={styles.tableContainer}>
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
            {successMessage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={successMessage}
                />
            )}
        </>
    );
};

export default PostServer;