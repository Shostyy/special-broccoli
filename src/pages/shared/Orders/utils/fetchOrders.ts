import { fetchClientFullResponse } from '../../../../api/fetchClientFullResponse';
import { OrderData } from '../../../../api/types/orderData';
import { BASE_URL } from '../../../../data/constants/constants';

export const fetchOrders = async (
    tradePointIds: number[],
    setOrdersData: React.Dispatch<React.SetStateAction<OrderData[] | null>>,
): Promise<void> => {
    try {
        if (tradePointIds.length > 0) {
            const ordersResponse = await fetchClientFullResponse.post<OrderData[]>(`${BASE_URL}/api/orders/by-trade-point-ids`, tradePointIds, 'application/json');
            if (ordersResponse.data) {
                setOrdersData(ordersResponse.data);
            }
        }
    } catch (err: any) {
        if (err.status === 401) {
            window.location.reload();
        }

    } finally {
        console.log('Orders fetched.');
    }
};

export default fetchOrders;