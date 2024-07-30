import { CommercialEquipment } from './commercialEquipment';
import { EquipmentCounter } from './equipmentCounter';

export interface CommercialEquipmentWithCounter extends CommercialEquipment {
    equipmentCounters: EquipmentCounter[];
}