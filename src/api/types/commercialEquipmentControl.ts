import { CountersControl } from './countersControl';
import { MaterialControl } from './materialControl';

export interface CommercialEquipmentControl {
    id: number;
    date: string;
    tradePointId: number;
    tradePointName: string;
    countersControl: CountersControl[];
    materialsControl: MaterialControl[];
}