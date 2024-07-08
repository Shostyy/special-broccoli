import { ItemsInOrder } from './itemsInOrder';
import { ProductData } from './productData';
import { TradePointData } from './tradePointData';

export interface OrderData {
    id: number;
    status: string;
    docNumber: string | null;
    dateCreated: Date | string;//TODO remove string
    tradePoint: TradePointData;
    items: ItemsInOrder[];
    sum: number;
    comment: string;
}

