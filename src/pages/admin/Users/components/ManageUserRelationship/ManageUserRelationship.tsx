import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../../../types/hooks';
import { fetchCustomersForDialogAsync, fetchUsersForDialogAsync } from '../../../../../redux/slices/relationshipDialogSlice';
import { useTranslation } from 'react-i18next';
import ErrorSuccessModal from '../ErrorSuccessModal/ErrorSuccessModal';
import { AddRelationshipDialog } from '../AddRelationshipDialog';
import styles from './styles/styles.module.css';

const ManageUserRelationship: React.FC = () => {
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchUsersForDialogAsync());
        dispatch(fetchCustomersForDialogAsync());
    }, [dispatch]);

    const handleAddClick = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };



    return (
        <>
            <div className="p-4">
                <button
                    className={styles.saveButton}
                    onClick={handleAddClick}
                >
                    {t('Add')}
                </button>

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

            </div>

            {isAddDialogOpen && (
                <AddRelationshipDialog
                    onClose={handleAddDialogClose}
                    onSuccess={setSuccessMessage}
                    onError={setErrorMessage}
                />
            )}
        </>

    );
}

export default ManageUserRelationship;
