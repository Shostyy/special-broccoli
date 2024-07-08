import { fetchClientFullResponse } from '../../../../api/fetchClientFullResponse';
import { TradePointData } from '../../../../api/types/tradePointData';
import { BASE_URL } from '../../../../data/constants/constants';

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
    } catch (err) {
        console.error(err);
    } finally {
        console.log('Trade points fetched.');
    }
};

export default fetchTradePoints;