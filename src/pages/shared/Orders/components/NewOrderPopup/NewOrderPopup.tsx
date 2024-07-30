import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { useOrderManagement } from './hooks/useOrderManagement';
import TradePointSelection from './components/TradePointSelection';
import ProductSearch from './components/ProductSearch';
import CartButton from './components/CartButton';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import ConfirmationStep from './components//ConfirmationStep';
import styles from './styles/styles.module.css';
import { TradePointData } from '../../../../../api/types/tradePointData';
import { OrderData } from '../../../../../api/types/orderData';
import CustomErrorModal from './components/CustomErrorModal';

interface NewOrderPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (savedOrderId: number) => void;
    tradePointsForOrders: TradePointData[];
    editOrder?: OrderData | null;
    copyOrder?: OrderData | null;
}

const NewOrderPopup: React.FC<NewOrderPopupProps> = ({
    isOpen,
    onSuccess,
    tradePointsForOrders,
    editOrder,
    copyOrder,
}) => {
    const { t } = useTranslation();
    const {
        selectedTradePoint,
        currentStep,
        searchTerm,
        selectedProducts,
        groupedProducts,
        expandedCategories,
        totalSelectedSum,
        handleSelectTradePoint,
        handleSearch,
        setCurrentStep,
        handleSelectAllCategories,
        handleClearCategories,
        toggleCategory,
        handleProductSelect,
        handleProductRemove,
        setSelectedProducts,
        handleConfirmOrder,
        updateStatus,
        comment,
        setComment,
        filteredProducts,
        unavailableList,
        currentOrder,
        initializeError,
        confirmationError,
        handleProcessOrder,
    } = useOrderManagement(tradePointsForOrders, editOrder, copyOrder, onSuccess);

    if (!isOpen) return null;

    const handleCloseAndSave = async () => {
        if (currentOrder) {
            const success = await handleConfirmOrder();

            if (success) {
                onSuccess(currentOrder.id);
            }
        }
    }

    const handleCloseAndProcess = async () => {
        if (currentOrder) {
            const success = await handleProcessOrder();

            if (success) {
                onSuccess(currentOrder.id);
            }
        }
    }

    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        if (unavailableList && unavailableList.length > 0) {
            setShowErrorModal(true);
        }
    }, [unavailableList]);

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>
                        {editOrder ? t('EditOrder') :
                            copyOrder ? t('CopyOrder') :
                                currentStep === 0 ? t('CreateNewOrder') :
                                    currentStep === 1 ? t('PickUpProductsForOrder') :
                                        t('ConfirmOrder')}
                    </h2>
                    <button className={styles.closeButton} onClick={handleCloseAndSave}>
                        <CloseIcon />
                    </button>
                </div>

                {currentStep === 1 && (
                    <>
                        <div className={styles.topWrapper}>
                            <TradePointSelection
                                selectedTradePoint={selectedTradePoint}
                                tradePointsForOrders={tradePointsForOrders}
                                onSelect={handleSelectTradePoint}
                                editOrder={editOrder || null}
                                copyOrder={copyOrder || null}
                            />
                            <ProductSearch searchTerm={searchTerm} onSearch={handleSearch} />
                            <CartButton totalSelectedSum={totalSelectedSum} onClick={() => setCurrentStep(2)} tradePointSelected={!!selectedTradePoint}/>
                        </div>
                        <div className={styles.mainContent}>
                            <CategoryList
                                groupedProducts={groupedProducts}
                                expandedCategories={expandedCategories}
                                toggleCategory={toggleCategory}
                                handleSelectAllCategories={handleSelectAllCategories}
                                handleClearCategories={handleClearCategories}
                                updateStatus={updateStatus}
                                selectedTradePoint={selectedTradePoint}
                                initializeError={initializeError}
                            />
                            <ProductList
                                groupedProducts={groupedProducts}
                                expandedCategories={expandedCategories}
                                selectedProducts={selectedProducts}
                                handleProductSelect={handleProductSelect}
                                handleProductRemove={handleProductRemove}
                                setSelectedProducts={setSelectedProducts}
                                filteredProducts={filteredProducts}
                                displayType="full"
                            />
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <ConfirmationStep
                        selectedProducts={selectedProducts}
                        handleProductSelect={handleProductSelect}
                        handleProductRemove={handleProductRemove}
                        setSelectedProducts={setSelectedProducts}
                        totalSelectedSum={totalSelectedSum}
                        comment={comment}
                        setComment={setComment}
                        onBack={() => setCurrentStep(1)}
                        onConfirm={handleCloseAndProcess}
                        confirmationError={confirmationError}
                    />
                )}
                {showErrorModal && unavailableList && unavailableList.length > 0 && (
                    <CustomErrorModal
                        unavailableList={unavailableList}
                        onClose={handleCloseErrorModal}
                    />
                )}

            </div>
        </div>
    );
};

export default NewOrderPopup;