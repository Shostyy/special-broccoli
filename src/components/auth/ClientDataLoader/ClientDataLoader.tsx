import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { setError } from '../../../redux/slices/appErrorSlice';
import ordersApi from '../../../api/methods/ordersApi';
import { updatePricesAndRemains } from '../../../utils/updatePricesAndRemains';

const ClientDataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.login.userInfo);

  useEffect(() => {
    if (userInfo && userInfo.role.name === 'CLIENT') {
      const fetchAndUpdateTradePoints = async () => {
        try {
          const res = await ordersApi.getTradePointForOrders();
          console.log('tp', res);
          updatePricesAndRemains(res);
        } catch (error) {
          dispatch(setError({
            error: true,
            errorKey: 'error'
          }));
        }
      };

      fetchAndUpdateTradePoints();
    }
  }, [userInfo, dispatch]);

  return <>{children}</>;
};

export default ClientDataLoader;