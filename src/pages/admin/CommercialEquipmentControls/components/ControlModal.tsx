import React, { useMemo } from 'react';
import { Modal, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import close icon
import styles from '../styles/CommercialEquipmentControl.module.css';
import { MRT_ColumnDef } from 'material-react-table';
import { CountersControl } from '../../../../api/types/countersControl';
import { MaterialControl } from '../../../../api/types/materialControl';
import { SimpleTable } from '../../../../components/common';
import { useTranslation } from 'react-i18next';

interface ControlModalProps {
    open: boolean;
    onClose: () => void;
    selectedRow: any;
    selectedTab: string;
    handleTabChange: (newValue: string) => void;
}

const ControlModal: React.FC<ControlModalProps> = ({ open, onClose, selectedRow, selectedTab, handleTabChange }) => {
    const { t } = useTranslation();

    const counterControlColumns = useMemo<MRT_ColumnDef<CountersControl, keyof CountersControl>[]>(() => [
        { size: 40, minSize: 20, accessorKey: 'counterId', header: '№' },
        { size: 40, minSize: 20, accessorKey: 'counterName', header: t('Name') },
        { size: 40, minSize: 20, accessorKey: 'commercialEquipmentName', header: t('CommercialEquipment') },
        { size: 40, minSize: 20, accessorKey: 'currentCount', header: t('CounterAct') },
        { size: 220, minSize: 220, accessorKey: 'previousCount', header: t('CounterPrev') },
        { size: 40, minSize: 20, accessorKey: 'made', header: t('Made') },
        { size: 40, minSize: 20, accessorKey: 'exceeded', header: t('Exceeded') },
    ], []);

    const materialControlColumns = useMemo<MRT_ColumnDef<MaterialControl, keyof MaterialControl>[]>(() => [
        { size: 40, minSize: 20, accessorKey: 'materialId', header: `${t('Material')} ${'ID'}` },
        { size: 40, minSize: 20, accessorKey: 'materialName', header: t('Material') },
        { size: 200, minSize: 200, accessorKey: 'previousRemain', header: t('PreviousRemain') },
        { size: 40, minSize: 20, accessorKey: 'shipped', header: t('Shipped') },
        { size: 220, minSize: 220, accessorKey: 'spent', header: t('SpentCalc') },
        { size: 200, minSize: 200, accessorKey: 'remainderCalc', header: t('RemainCalc') },
        { size: 40, minSize: 20, accessorKey: 'remainderActual', header: t('RemainAct') },
        { size: 40, minSize: 20, accessorKey: 'excess', header: t('Excess') },
        { size: 40, minSize: 20, accessorKey: 'lack', header: t('Lack') },
    ], []);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className={styles.popupContent}>
                <div className={styles.modalHeader}>
                    <ToggleButtonGroup
                        value={selectedTab}
                        exclusive
                        onChange={(event, newValue) => handleTabChange(newValue)}
                        aria-label="Table Mode"
                        sx={{ bgcolor: '#fff' }}
                    >
                        <ToggleButton value="Counters">{t('Counters')}</ToggleButton>
                        <ToggleButton value="Materials">{t('Materials')}</ToggleButton>
                    </ToggleButtonGroup>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles.tableContainer}>
                    {selectedTab === 'Counters' && selectedRow.countersControl && (
                        <div style={{ flex: 1 }}>
                            <SimpleTable
                                columns={counterControlColumns}
                                rows={selectedRow.countersControl}
                                density='compact'
                                customRowHeight={37}
                                enableFiltering={false}
                            />
                        </div>
                    )}
                    {selectedTab === 'Materials' && selectedRow.materialsControl && (
                        <div style={{ flex: 1 }}>
                            <SimpleTable
                                columns={materialControlColumns}
                                rows={selectedRow.materialsControl}
                                density='compact'
                                customRowHeight={37}
                                enableFiltering={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ControlModal;
