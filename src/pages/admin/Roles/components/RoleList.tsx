import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Roles.module.css';

interface Role {
    id: number;
    name: string;
}

interface RoleListProps {
    roles: Role[];
    selectedRoleId: number | null;
    onRoleSelect: (roleId: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, selectedRoleId, onRoleSelect }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.roleList}>
            {roles.map((role) => (
                <div key={role.id} className={styles.roleItem}>
                    <label className={styles.roleLabel}>
                        <input
                            type="radio"
                            name="role"
                            value={role.id}
                            className={styles.roleInput}
                            checked={selectedRoleId === role.id}
                            onChange={() => onRoleSelect(role.id)}
                        />
                        <span>{t(role.name)}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RoleList;