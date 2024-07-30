import React from 'react';
import { HandbookPage } from '../../../components/common';
import { useProductRemains } from './hooks/useProductRemains';
import ProductRemainsTable from './components/ProductRemainsTable';
import { BranchOfficesSelect } from '../../../components/common';
import { ProductsRemain } from '../../../api/types/productsRemain';

const ProductRemains: React.FC = () => {
    const {
        productRemains,
        updateStatus,
        handleUpdate,
        loading,
        branchOffices,
        handleBranchOfficeChange,
    } = useProductRemains();

    return (
        <HandbookPage<ProductsRemain>
            items={productRemains}
            loading={loading}
            updateStatus={updateStatus}
            handleUpdate={handleUpdate}
            TableComponent={ProductRemainsTable}
            leftSideControls={
                branchOffices && (
                    <BranchOfficesSelect
                        branchOfficeList={branchOffices}
                        onSelect={handleBranchOfficeChange}
                        color="white"
                        width={300}
                    />
                )
            }
        />
    );
};

export default ProductRemains;