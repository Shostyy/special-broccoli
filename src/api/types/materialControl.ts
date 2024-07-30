export interface MaterialControl {
    controlId: number;
    materialId: number;
    materialName: string;
    previousRemain: number;
    shipped: number;
    spent: number;
    remainderCalc: number;
    remainderActual: number;
    excess: number;
    lack: number;
};