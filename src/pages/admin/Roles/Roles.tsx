import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from './hooks/useRoles';
import styles from './styles/Roles.module.css';
import { GeneralButton } from '../../../components/common';
import ErrorSuccessText from '../../../components/common/ErrorSuccessText/ErrorSuccessText';
import RoleList from './components/RoleList';

const Roles: React.FC = () => {
    const { t } = useTranslation();
    const {
        allRoles,
        selectedRoleId,
        deleteSuccessMessage,
        deleteErrorMessage,
        createSuccessMessage,
        createErrorMessage,
        handleDelete,
        formik,
        handleRoleSelection,
        handleRoleNameChange,
    } = useRoles();

    if (!allRoles || !allRoles.length) {
        return null;
    }

    const renderMessage = (errorMessage: string | null, successMessage: string | null) => {
        if (errorMessage) {
            return <ErrorSuccessText type='error' message={errorMessage} />;
        }
        if (successMessage) {
            return <ErrorSuccessText type='success' message={successMessage} />;
        }
        return null;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.half}>
                <h2 className={styles.title}>{t('CurrentRs')}</h2>
                <RoleList
                    roles={allRoles}
                    selectedRoleId={selectedRoleId}
                    onRoleSelect={handleRoleSelection}
                />
                <div className={styles.messageContainer}>
                    {renderMessage(deleteErrorMessage, deleteSuccessMessage)}
                </div>
                <GeneralButton
                    onClick={() => handleDelete(selectedRoleId || 0, allRoles.find(role => role.id === selectedRoleId)?.name || '')}
                    translationKey={selectedRoleId !== null ? t('Delete') : t('RoleNotification')}
                    disabled={!selectedRoleId}
                    variant='filled'
                    size="full"
                />
            </div>
            <div className={styles.half}>
                <form onSubmit={formik.handleSubmit} className={styles.form}>
                    <div className={styles.formTop}>
                        <h2 className={styles.title}>{t('NewRole')}</h2>
                        <label htmlFor="roleName" className={styles.label}>{t('EnterNewRole')}</label>
                        <input
                            type="text"
                            id="roleName"
                            name="roleName"
                            className={`${styles.input} ${formik.errors.roleName ? styles.inputError : ''}`}
                            onChange={handleRoleNameChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.roleName}
                        />
                        <div className={styles.messageContainer}>
                            {renderMessage(
                                formik.touched.roleName && formik.errors.roleName ? 
                                    formik.errors.roleName as string : 
                                    createErrorMessage,
                                createSuccessMessage
                            )}
                        </div>
                    </div>
                    <div className={styles.formBottom}>
                        <GeneralButton
                            type='submit'
                            disabled={formik.isSubmitting || !formik.values.roleName}
                            translationKey='Create'
                            variant='filled'
                            size='full'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Roles;