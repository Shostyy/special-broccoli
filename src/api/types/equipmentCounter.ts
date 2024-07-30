import { DrinkPrice } from './drinkPrice';

export interface EquipmentCounter {
    commercialEquipmentId: number;
    counterId: number;
    counterName: string;
    latestPrice: DrinkPrice | null;
}