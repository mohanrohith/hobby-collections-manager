import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ItemManager } from './pages/ItemManager';
import { CategoryManager } from './pages/CategoryManager';
import { EmulatorTest } from './pages/EmulatorTest';
import { AuthTest } from './pages/AuthTest';
import { Navigation } from './components/Navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<ItemManager />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/emulator-test" element={<EmulatorTest />} />
            <Route path="/auth-test" element={<AuthTest />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
