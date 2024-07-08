import { useAppDispatch, useAppSelector } from './types/hooks';
import './styles.css';
import { AuthChecker } from './components/auth/AuthChecker';
import { fetchUserInfoAsync } from './redux/slices/loginSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.login.userInfo);

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfoAsync());
    }
  }, [dispatch]); 



  return (
    <div className="App">
      <AuthChecker />
    </div>
  );
}

export default App;
