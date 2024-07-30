import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../types/hooks';
import { fetchProductsAsync } from '../../../../../../redux/slices/productsSlice';
import { TradePointData } from '../../../../../../api/types/tradePointData';
import { PresentProduct } from '../../../../../../api/types/presentProduct';
import { OrderData } from '../../../../../../api/types/orderData';
import { fetchClientFullResponse } from '../../../../../../api/fetchClientFullResponse';
import { BASE_URL, UNAUTHORIZED_STATUS_CODE } from '../../../../../../data/constants/constants';
import productPricesApi from '../../../../../../api/methods/productPricesApi';
import productRemainsApi from '../../../../../../api/methods/productRemainsApi';
import { groupProductsByCategory } from '../utils/groupProductsByCategory';
import { convertOrderItemsToPresentProducts, createOrderRequestData, createOrderUpdateData } from '../utils/orderHelpers';

export const useOrderManagement = (
    tradePointsForOrders: TradePointData[],
    editOrder: OrderData | null | undefined,
    copyOrder: OrderData | null | undefined,
    onSuccess: (savedOrderId: number) => void,
) => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products);

    const [selectedTradePoint, setSelectedTradePoint] = useState<TradePointData | null>(null);
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [currentProductsList, setCurrentProductsList] = useState<PresentProduct[] | null>(null);
    const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [groupedProducts, setGroupedProducts] = useState<{ [category: string]: PresentProduct[] }>({});
    const [expandedCategories, setExpandedCategories] = useState<{ [category: string]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<PresentProduct[]>([]);
    const [comment, setComment] = useState('');
    const [unavailableList, setUnavailableList] = useState<PresentProduct[] | null>(null);
    const [initializeError, setInitializeError] = useState<string | null>();
    const [confirmationError, setConfirmationError] = useState<string | null>();

    const initiateNewOrder = useCallback((tradePoint: TradePointData) => {
        const requestData = createOrderRequestData(tradePoint);

        setInitializeError(null);

        fetchClientFullResponse.post<OrderData>(`${BASE_URL}/api/orders`, requestData, 'application/json')
            .then(response => {
                setCurrentOrder(response.data);
            })
            .catch((err: any) => {
                if (err.status === UNAUTHORIZED_STATUS_CODE) {
                    window.location.reload();
                } else {
                    setInitializeError('FailedToRegisterOrder');
                }
            });
    }, []);

    useEffect(() => {
        if (currentProductsList && selectedProducts && (currentOrder?.tradePoint.name !== selectedTradePoint?.name)) {
            const updatedPrices: PresentProduct[] = [];
            const unavailableProductList: PresentProduct[] = [];

            selectedProducts.forEach(product => {
                const updatedProduct = currentProductsList.find(item => item.productId === product.productId);
                if (updatedProduct) {
                    updatedPrices.push({
                        ...product,
                        price: updatedProduct.price,
                    });
                } else {
                    unavailableProductList.push(product);
                }
            });

            setSelectedProducts(updatedPrices);
            setUnavailableList(unavailableProductList);
        }
    }, [currentProductsList]);



    const updatePricesAndRemains = useCallback((tradePoint: TradePointData) => {
        setUpdateStatus('pending');

        const storedPriceIds = JSON.parse(sessionStorage.getItem('updatedPriceIds') || '[]');
        const storedRemainIds = JSON.parse(sessionStorage.getItem('updatedRemainIds') || '[]');

        const updatePrices = !storedPriceIds.includes(tradePoint.id);
        const updateRemains = tradePoint.branchOfficeId && !storedRemainIds.includes(tradePoint.branchOfficeId);

        const promises: Promise<any>[] = [];

        if (updatePrices) {
            promises.push(productPricesApi.subscribeForUpdateProductPricesNoActions(tradePoint.id));
            storedPriceIds.push(tradePoint.id.toString());
            sessionStorage.setItem('updatedPriceIds', JSON.stringify(storedPriceIds));
        }

        if (updateRemains) {
            promises.push(productRemainsApi.subscribeForUpdateProductRemainsNoActions(tradePoint.branchOfficeId!));
            storedRemainIds.push(tradePoint.branchOfficeId!.toString());
            sessionStorage.setItem('updatedRemainIds', JSON.stringify(storedRemainIds));
        }

        const fetchProducts = () => {
            return fetchClientFullResponse.get<PresentProduct[]>(`${BASE_URL}/api/product-prices/for-order/${tradePoint.id}`)
                .then(res => {
                    setCurrentProductsList(res.data);
                    dispatch(fetchProductsAsync());
                });
        };

        if (promises.length > 0) {
            Promise.all(promises)
                .then(() => {
                    setUpdateStatus('success');
                    return fetchProducts();
                })
                .catch(err => {
                    console.error(err);
                    setUpdateStatus('error');
                    setCurrentProductsList(null);
                });
        } else {
            fetchProducts()
                .then(() => {
                    setUpdateStatus('success');
                })
                .catch((err: any) => {
                    console.error(err);
                    setUpdateStatus('error');
                });
        }
    }, [dispatch]);

    useEffect(() => {
        if (products && currentProductsList) {
            const grouped = groupProductsByCategory(currentProductsList, products);
            setGroupedProducts(grouped);
        }
    }, [products, currentProductsList]);

    const handleSelectTradePoint = useCallback((tradePoint: TradePointData | null) => {
        if (tradePoint) {
            setSelectedTradePoint(tradePoint);
            setCurrentProductsList(null);
            setGroupedProducts({});
            updatePricesAndRemains(tradePoint);

            if (!copyOrder && !editOrder) {
                initiateNewOrder(tradePoint);
            }
        }
    }, [updatePricesAndRemains, initiateNewOrder]);

    const handleSelectAllCategories = useCallback(() => {
        setExpandedCategories(() =>
            Object.keys(groupedProducts).reduce((acc, category) => ({ ...acc, [category]: true }), {}),
        );
    }, [groupedProducts]);

    const handleClearCategories = useCallback(() => {
        setExpandedCategories({});
    }, []);

    const toggleCategory = useCallback((category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    }, []);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleProductSelect = useCallback((product: PresentProduct) => {
        setSelectedProducts(prev => {
            const existingProduct = prev.find(p => p.productId === product.productId);
            if (existingProduct) {
                return prev.map(p =>
                    p.productId === product.productId ? { ...p, quantity: p.quantity + 1 } : p,
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    }, []);

    const handleProductRemove = useCallback((product: PresentProduct) => {
        setSelectedProducts(prev => {
            return prev.map(p =>
                p.productId === product.productId
                    ? { ...p, quantity: Math.max(0, p.quantity - 1) }
                    : p
            );
        });
    }, []);

    const filteredProducts = useCallback((category: string) => {
        const productsInCategory = groupedProducts[category] || [];
        if (!searchTerm) return productsInCategory;

        return productsInCategory.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productId.toString().includes(searchTerm),
        );
    }, [groupedProducts, searchTerm]);

    const totalSelectedSum = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    const handleConfirmOrder = useCallback(async () => {
        setConfirmationError(null);
        const order = createOrderUpdateData(currentOrder, selectedProducts, comment);
    
        try {
            await fetchClientFullResponse.put(`${BASE_URL}/api/orders`, order, 'application/json');
            setSelectedTradePoint(null);
            setSelectedProducts([]);
    
            if (order.id) {
                onSuccess(order.id);
            }
    
            return true;
        } catch (err: any) {
            if (err.status === UNAUTHORIZED_STATUS_CODE) {
                window.location.reload();
            } else {
                console.log('Error:', err);
                setConfirmationError('OrdersUpdError');
            }
    
            return false;
        }
    }, [currentOrder, selectedProducts, comment, onSuccess]);

    const handleProcessOrder = useCallback(async () => {
        setConfirmationError(null);
        const order = createOrderUpdateData(currentOrder, selectedProducts, comment);
    
        try {
            await fetchClientFullResponse.post(`${BASE_URL}/api/orders/order/process`, order, 'application/json');
            setSelectedTradePoint(null);
            setSelectedProducts([]);
    
            if (order.id) {
                onSuccess(order.id);
            }
    
            return true;
        } catch (err: any) {
            if (err.status === UNAUTHORIZED_STATUS_CODE) {
                window.location.reload();
            } else {
                console.log('Error:', err);
                setConfirmationError('OrdersUpdError');
            }
    
            return false;
        }
    }, [currentOrder, selectedProducts, comment, onSuccess]);
    
    const handleCloseAndSave = async () => {
        if (currentOrder) {
            const success = await handleConfirmOrder();
    
            console.log('Confirmation Error:', confirmationError);
    
            if (success) {
                onSuccess(currentOrder.id);
            }
        }
    }
    

    const handleCopyOrder = useCallback(async (orderToUse: OrderData) => {
        try {
            const tradePoint = orderToUse.tradePoint;
            const convertedItems = convertOrderItemsToPresentProducts(orderToUse);

            const requestData = createOrderRequestData(tradePoint);
            const response = await fetchClientFullResponse.post<OrderData>(`${BASE_URL}/api/orders`, requestData, 'application/json');
            const newOrder = response.data;

            const orderUpdateData = createOrderUpdateData(newOrder, convertedItems, orderToUse.comment);

            await fetchClientFullResponse.put(`${BASE_URL}/api/orders`, orderUpdateData, 'application/json');

            setSelectedTradePoint(tradePoint);
            setSelectedProducts(convertedItems);
            setComment(orderToUse.comment);
            setCurrentOrder(newOrder);

            updatePricesAndRemains(tradePoint);
        } catch (err: any) {
            if (err.status === UNAUTHORIZED_STATUS_CODE) {
                window.location.reload();
            }
        }
    }, [updatePricesAndRemains, onSuccess]);

    useEffect(() => {
        if (editOrder || copyOrder) {
            const orderToUse = editOrder || copyOrder;
            if (orderToUse) {
                if (copyOrder) {
                    handleCopyOrder(orderToUse);
                } else {
                    const convertedItems = convertOrderItemsToPresentProducts(orderToUse);
                    setSelectedTradePoint(orderToUse.tradePoint);
                    setSelectedProducts(convertedItems);
                    setComment(orderToUse.comment);
                    setCurrentOrder(orderToUse);
                    updatePricesAndRemains(orderToUse.tradePoint);
                }
            }
        }
    }, [editOrder, copyOrder, handleCopyOrder, updatePricesAndRemains]);

    return {
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
        handleProcessOrder
    };
};
