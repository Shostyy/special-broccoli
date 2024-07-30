import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { UserDialog } from '../../../../../api/types/userDialog';
import { CustomerData } from '../../../../../api/types/customerData';
import { fetchUsersRelationshipAsync } from '../../../../../redux/slices/usersRelationshipSlice';
import { useAppDispatch, useAppSelector } from '../../../../../types/hooks';
import CustomerSelect from '../../../../../components/common/Selects/CustomerSelect';
import UserSelect from '../../../../../components/common/Selects/UserSelect';
import relationshipApi from '../../../../../api/methods/relationshipApi';
import styles from './styles/styles.module.css';

interface AddRelationshipDialogProps {
    onClose: () => void;
    onSuccess: (message: string | null) => void;
    onError: (message: string | null) => void;
}

const AddRelationshipDialog: React.FC<AddRelationshipDialogProps> = ({ onClose, onSuccess, onError }) => {
    const users = useAppSelector(state => state.relationshipDialog.usersForDialog);
    const customers = useAppSelector(state => state.relationshipDialog.customersForDialog);
    const [selectedUser, setSelectedUser] = useState<UserDialog | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleSaveUserRelationship = () => {
        if (!selectedUser || !selectedCustomer) {
            return;
        }

        const relationshipToAdd = {
            userId: selectedUser.id,
            userLogin: selectedUser.login,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
        };

        relationshipApi.addRelationship(relationshipToAdd)
            .then(() => {
                onSuccess(t('RelationshipSaveSuccess'));
                setTimeout(() => {
                    onSuccess(null);
                }, 1500);
                setSelectedUser(null);
                setSelectedCustomer(null);
                dispatch(fetchUsersRelationshipAsync());
            })
            .catch(() => {
                onError(t('GeneralError'));
                setTimeout(() => {
                    onError(null);
                }, 2500);
            })
            .finally(() => {
                onClose();
            });
    };

    const handleUserChange = (user: UserDialog | null) => {
        setSelectedUser(user);
    };

    const handleCustomerChange = (customer: CustomerData | null) => {
        setSelectedCustomer(customer);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.modalWrapper}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
                <div className={styles.contentWrapper}>
                    <div className={styles.inputWrapper}>
                        <label className={styles.label}>
                            {t('UserLogin')}
                        </label>
                        {users && (
                            <UserSelect
                                userList={users}
                                onSelect={handleUserChange}
                                height={56}
                                width={300}
                            />
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <label className={styles.label}>
                            {t('CustomerName')}
                        </label>
                        {customers && (
                            <CustomerSelect
                                customersList={customers}
                                onSelect={handleCustomerChange}
                                height={56}
                                width={300}
                            />
                        )}
                    </div>
                    <button
                        className={`${styles.confirmButton} ${(!selectedUser || !selectedCustomer) && styles.grayscale}`}
                        onClick={handleSaveUserRelationship}
                        disabled={!selectedUser || !selectedCustomer}
                    >
                        {t('Save')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRelationshipDialog;
