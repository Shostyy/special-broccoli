import { OrderData } from '../../../../../../api/types/orderData';
import { PresentProduct } from '../../../../../../api/types/presentProduct';
import { TradePointData } from '../../../../../../api/types/tradePointData';

export const convertOrderItemsToPresentProducts = (order: OrderData): PresentProduct[] => {
    return order.items.map(item => ({
        tradePointId: order.tradePoint.id,
        productId: item.productId,
        branchOfficeId: order.tradePoint.branchOfficeId || 0,
        productName: item.productName,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
        present: true,
    }));
};

export const createOrderRequestData = (tradePoint: TradePointData) => {
    return { tradePoint };
};

export const createOrderUpdateData = (currentOrder: OrderData | null, selectedProducts: PresentProduct[], comment: string) => {
    const orderItems = selectedProducts.map(product => ({
        orderId: currentOrder?.id || 0,
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        quantity: product.quantity,
        price: product.price,
    }));

    return {
        ...currentOrder,
        items: orderItems,
        comment: comment,
    };
};