import { fetchClientFullResponse } from '../../../../api/fetchClientFullResponse';
import { OrderData } from '../../../../api/types/orderData';
import { BASE_URL, UNAUTHORIZED_STATUS_CODE } from '../../../../data/constants/constants';

export const fetchOrders = async (
    tradePointIds: number[],
    setOrdersData: React.Dispatch<React.SetStateAction<OrderData[] | null>>,
    setProgress?: React.Dispatch<React.SetStateAction<number>>,
): Promise<void> => {
    try {
        const batchSize = 50;
        let allOrders: OrderData[] = [];
        const totalBatches = Math.ceil(tradePointIds.length / batchSize);

        for (let i = 0; i < tradePointIds.length; i += batchSize) {
            const batch = tradePointIds.slice(i, i + batchSize);
            const ordersResponse = await fetchClientFullResponse.post<OrderData[]>(
                `${BASE_URL}/api/orders/by-trade-point-ids`,
                batch,
                'application/json'
            );

            if (ordersResponse.data) {
                allOrders = [...allOrders, ...ordersResponse.data];
                setOrdersData(allOrders);
                if (setProgress) {
                    setProgress(((i + batchSize) / tradePointIds.length) * 100);
                }
            }
        }
    } catch (err: any) {
        if (err.status === UNAUTHORIZED_STATUS_CODE) {
            window.location.reload();
        }
    }
};

export default fetchOrders;