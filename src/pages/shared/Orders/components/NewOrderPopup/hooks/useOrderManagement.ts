import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../types/hooks';
import { fetchProductsAsync } from '../../../../../../redux/slices/productsSlice';
import { TradePointData } from '../../../../../../api/types/tradePointData';
import { PresentProduct } from '../../../../../../api/types/presentProduct';
import { OrderData } from '../../../../../../api/types/orderData';
import { fetchClientFullResponse } from '../../../../../../api/fetchClientFullResponse';
import { BASE_URL } from '../../../../../../data/constants/constants';
import productPricesApi from '../../../../../../api/methods/productPricesApi';
import productRemainsApi from '../../../../../../api/methods/productRemainsApi';
import { groupProductsByCategory } from '../utils/groupProductsByCategory';
import { convertOrderItemsToPresentProducts, createOrderRequestData, createOrderUpdateData } from '../utils/orderHelpers';

export const useOrderManagement = (
    tradePointsForOrders: TradePointData[],
    editOrder: OrderData | null | undefined,
    copyOrder: OrderData | null | undefined,
    onSuccess: () => void
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

    useEffect(() => {
        if (editOrder || copyOrder) {
            const orderToUse = editOrder || copyOrder;
            if (orderToUse) {
                const convertedItems = convertOrderItemsToPresentProducts(orderToUse);
                setSelectedTradePoint(orderToUse.tradePoint);
                setSelectedProducts(convertedItems);
                setComment(orderToUse.comment);

                if (copyOrder) {
                    initiateNewOrder(orderToUse.tradePoint);
                } else {
                    setCurrentOrder(orderToUse);
                }

                updatePricesAndRemains(orderToUse.tradePoint);
            }
        }
    }, [editOrder, copyOrder]);

    const initiateNewOrder = useCallback((tradePoint: TradePointData) => {
        const requestData = createOrderRequestData(tradePoint);

        fetchClientFullResponse.post<OrderData>(`${BASE_URL}/api/orders`, requestData, 'application/json')
            .then(response => {
                setCurrentOrder(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const updatePricesAndRemains = useCallback((tradePoint: TradePointData) => {
        setUpdateStatus('pending');
        setCurrentStep(1);

        const storedPriceIds = JSON.parse(sessionStorage.getItem('updatedPriceIds') || '[]');
        const storedRemainIds = JSON.parse(sessionStorage.getItem('updatedRemainIds') || '[]');

        const updatePrices = !storedPriceIds.includes(tradePoint.id.toString());
        const updateRemains = tradePoint.branchOfficeId && !storedRemainIds.includes(tradePoint.branchOfficeId.toString());

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
            updatePricesAndRemains(tradePoint);
            initiateNewOrder(tradePoint);
        }
    }, [updatePricesAndRemains, initiateNewOrder]);

    const handleSelectAllCategories = useCallback(() => {
        setExpandedCategories(prev =>
            Object.keys(groupedProducts).reduce((acc, category) => ({ ...acc, [category]: true }), {})
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
                    p.productId === product.productId ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    }, []);

    const handleProductRemove = useCallback((product: PresentProduct) => {
        setSelectedProducts(prev => {
            const existingProduct = prev.find(p => p.productId === product.productId);
            if (existingProduct && existingProduct.quantity > 1) {
                return prev.map(p =>
                    p.productId === product.productId ? { ...p, quantity: p.quantity - 1 } : p
                );
            } else {
                return prev.filter(p => p.productId !== product.productId);
            }
        });
    }, []);

    const filteredProducts = useCallback((category: string) => {
        const productsInCategory = groupedProducts[category] || [];
        if (!searchTerm) return productsInCategory;

        return productsInCategory.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productId.toString().includes(searchTerm)
        );
    }, [groupedProducts, searchTerm]);

    const totalSelectedSum = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    const handleConfirmOrder = useCallback(() => {
        const order = createOrderUpdateData(currentOrder, selectedProducts, comment);

        fetchClientFullResponse.put(`${BASE_URL}/api/orders`, order, 'application/json')
            .then(() => {
                setSelectedTradePoint(null);
                setSelectedProducts([]);
                onSuccess();
            })
            .catch((err: any) => console.log(err));
    }, [currentOrder, selectedProducts, comment, onSuccess]);

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
        filteredProducts
    };
};