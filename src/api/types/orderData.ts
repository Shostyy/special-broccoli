import { ItemsInOrder } from './itemsInOrder';
import { TradePointData } from './tradePointData';

export interface OrderData {
    id: number;
    status: string;
    docNumber: string | null;
    dateCreated: Date | string;
    tradePoint: TradePointData;
    items: ItemsInOrder[];
    sum: number;
    comment: string;
}

