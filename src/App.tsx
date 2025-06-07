import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthTest } from './pages/AuthTest';
import { EmulatorTest } from './pages/EmulatorTest';
import './App.css';
import { Home } from './pages/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="text-xl font-bold text-gray-800">
                      Collections Manager
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      to="/auth-test"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Auth Test
                    </Link>
                    <Link
                      to="/emulator-test"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Emulator Test
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/emulator-test" element={<EmulatorTest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
