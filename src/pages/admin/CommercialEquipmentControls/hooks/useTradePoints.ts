import { useEffect } from 'react';
import { useAppDispatch } from '../../../../types/hooks';
import { fetchTradePointAsync } from '../../../../redux/slices/tradePointsSlice';
const useTradePoints = (tradePointsList: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!tradePointsList) {
            dispatch(fetchTradePointAsync());
        }
    }, [tradePointsList, dispatch]);
};

export default useTradePoints;
