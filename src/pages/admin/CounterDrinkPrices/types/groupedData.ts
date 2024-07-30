import { CommercialEquipment } from '../../../../api/types/commercialEquipment';
import { CustomerData } from '../../../../api/types/customerData';
import { TradePointData } from '../../../../api/types/tradePointData';

export interface GroupedData {
    [customerId: string]: {
        customer: CustomerData;
        tradePoints: {
            [tradePointId: string]: {
                tradePoint: TradePointData;
                commercialEquipment: CommercialEquipment[];
            };
        };
    };
}