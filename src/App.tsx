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
import Landing from './pages/Landing';
import { LLMProvider } from './context/llm-vlm/LLMContext';
import { ItemAnalysis } from './pages/ItemAnalysis';
import AutoAddItem from './pages/AutoAddItem';
import Devtools from './pages/Devtools';

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
        <LLMProvider>
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
                path="/items/auto-add"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <AutoAddItem />
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
              <Route
                path="/item-analysis"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ItemAnalysis />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/image-test"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ItemAnalysis />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/emulator-test"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <EmulatorTest />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/devtools"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Devtools />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </LLMProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
