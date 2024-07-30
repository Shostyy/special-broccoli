import { fetchClientFullResponse } from '../../../../api/fetchClientFullResponse';
import { TradePointData } from '../../../../api/types/tradePointData';
import { BASE_URL, UNAUTHORIZED_STATUS_CODE } from '../../../../data/constants/constants';

export const fetchTradePoints = async (
    setTradePointsForOrders: React.Dispatch<React.SetStateAction<TradePointData[] | null>>,
    setTradePointIds: React.Dispatch<React.SetStateAction<number[]>>,
): Promise<void> => {
    try {
        const tradePointsResponse = await fetchClientFullResponse.get<TradePointData[]>(`${BASE_URL}/api/trade-points/for-orders`);
        if (tradePointsResponse.data) {
            setTradePointsForOrders(tradePointsResponse.data);
            const tradePointIds = tradePointsResponse.data.map(tradePoint => tradePoint.id);
            setTradePointIds(tradePointIds);
        }
    } catch (err: any) {
        if (err.status === UNAUTHORIZED_STATUS_CODE) {
            window.location.reload();
        }
    }
};

export default fetchTradePoints;