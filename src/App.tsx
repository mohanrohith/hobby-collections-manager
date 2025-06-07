import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ItemDetail from './pages/ItemDetail';
import EditItem from './pages/EditItem';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Categories from './pages/Categories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { EmulatorTest } from './pages/EmulatorTest';
import { AuthTest } from './pages/AuthTest';
import TestFirestoreWrite from './pages/TestFirestoreWrite';
import Landing from './pages/Landing';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/items/new"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <AddItem />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/items/:id"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ItemDetail />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/items/:id/edit"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <EditItem />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route path="/emulator-test" element={<EmulatorTest />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/test-firestore" element={<TestFirestoreWrite />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
