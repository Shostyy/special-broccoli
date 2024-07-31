import './styles.css';
import { AuthChecker } from './components/auth/AuthChecker';
import { useLoginSync } from './hooks/useLoginSync';

function App() {
  useLoginSync();

  return (
    <div className="App">
      <AuthChecker />
    </div>
  );
}

export default App;