import { TradePointData } from '../api/types/tradePointData';
import productPricesApi from '../api/methods/productPricesApi';
import productRemainsApi from '../api/methods/productRemainsApi';

export const updatePricesAndRemains = async (tradePoints: TradePointData[]) => {
    const storedPriceIds = new Set<number>(JSON.parse(sessionStorage.getItem('updatedPriceIds') || '[]'));
    const storedRemainIds = new Set<number>(JSON.parse(sessionStorage.getItem('updatedRemainIds') || '[]'));
  
    const priceIds = new Set<number>();
    const remainIds = new Set<number>();
  
    tradePoints.forEach(tradePoint => {
      priceIds.add(tradePoint.id);
      if (tradePoint.branchOfficeId) {
        remainIds.add(tradePoint.branchOfficeId);
      }
    });
  
    console.log('tp ids', priceIds);
    console.log('bo ids', remainIds);
  
    const haveSameElements = (set1: Set<number>, set2: Set<number>): boolean => {
      if (set1.size !== set2.size) return false;
      for (let id of set1) {
        if (!set2.has(id)) return false;
      }
      return true;
    };
  
    if (haveSameElements(storedPriceIds, priceIds) && haveSameElements(storedRemainIds, remainIds)) {
      console.log('Stored IDs and current IDs match, no update required');
      return;
    }
  
    try {
      await productPricesApi.subscribeForUpdateAllPrices(priceIds);
      console.log('Price update promise resolved');
      sessionStorage.setItem('updatedPriceIds', JSON.stringify(Array.from(priceIds)));
    } catch (error) {
      console.error('Price update promise failed', error);
    }
  
    try {
      await productRemainsApi.subscribeForUpdateAllRemains(remainIds);
      console.log('Remain update promise resolved');
      sessionStorage.setItem('updatedRemainIds', JSON.stringify(Array.from(remainIds)));
    } catch (error) {
      console.error('Remain update promise failed', error);
    }
  };
  