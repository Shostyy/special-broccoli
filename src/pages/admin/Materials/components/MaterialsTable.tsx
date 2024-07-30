import React from 'react';
import { SimpleTable } from '../../../../components/common';
import { MaterialData } from '../../../../api/types/materialData';
import { useMaterialColumns } from '../hooks/useMaterialsColumns';

interface MaterialsTableProps {
    items: MaterialData[];
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ items }) => {
    const columns = useMaterialColumns();

    return (
        <SimpleTable
            columns={columns}
            rows={items}
            customRowHeight={54}
        />
    );
};

export default MaterialsTable;