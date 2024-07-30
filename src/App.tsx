import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './types/hooks';
import './styles.css';
import { AuthChecker } from './components/auth/AuthChecker';
import { fetchUserInfoAsync } from './redux/slices/loginSlice';
import { setError } from './redux/slices/appErrorSlice';
import ErrorPage from './components/common/ErrorPage/ErrorPage';
import ordersApi from './api/methods/ordersApi';
import { updatePricesAndRemains } from './utils/updatePricesAndRemains';

function App() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.login.userInfo);
  const { error } = useAppSelector(state => state.appError);

  useEffect(() => {
    if (!userInfo) {
      const x = dispatch(fetchUserInfoAsync());
      console.log(x);
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const fetchAndUpdateTradePoints = async () => {
      if (userInfo && userInfo.role.name === 'CLIENT') {
        try {
          ordersApi.getTradePointForOrders()
            .then(res => {
              console.log('tp', res);
              updatePricesAndRemains(res);
            })

        } catch (error: any) {
          dispatch(setError(error.message));
        }
      }
    };

    fetchAndUpdateTradePoints();
  }, [userInfo, dispatch]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLogin') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="App">
      <AuthChecker />
    </div>
  );
}

export default App;
