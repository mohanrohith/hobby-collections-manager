import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../services/authService';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm h-16 flex items-center px-4 relative">
      {/* Logo and Title */}
      <div ref={mobileMenuRef} className="flex items-center min-w-0 gap-3">
        {/* Hamburger menu for mobile (left of logo) */}
        {user && (
          <button
            className="block sm:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open navigation menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <Link to="/" className="flex-shrink-0 flex items-center gap-3 min-w-0">
          <svg
            className="h-8 w-auto"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="8" fill="#4f46e5" />
            <g transform="translate(8, 8)">
              <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx="2"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path d="M0 8 L24 8" stroke="white" strokeWidth="2" />
              <circle cx="6" cy="4" r="1.5" fill="white" />
              <circle cx="12" cy="4" r="1.5" fill="white" />
              <circle cx="18" cy="4" r="1.5" fill="white" />
              <rect x="4" y="12" width="4" height="4" rx="1" fill="white" />
              <rect x="10" y="12" width="4" height="4" rx="1" fill="white" />
              <rect x="16" y="12" width="4" height="4" rx="1" fill="white" />
            </g>
          </svg>
          {/* App title: hidden on mobile, shown on sm+ */}
          <span className="hidden sm:inline font-semibold text-xl text-gray-900 truncate max-w-[140px] sm:max-w-none">
            Hobby Collections Manager
          </span>
        </Link>
        {/* Navigation links, only visible on sm and up */}
        {user && (
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/dashboard"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/categories"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Categories
            </Link>
            <Link
              to="/items/auto-add"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Auto Add Item
            </Link>
            <Link
              to="/image-test"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Image Test
            </Link>
          </div>
        )}
      </div>
      {/* Mobile nav menu dropdown */}
      {user && isMobileMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border-b border-gray-200 shadow-lg z-40 flex flex-col sm:hidden animate-fade-in">
          <Link
            to="/dashboard"
            className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-100 w-full"
          >
            Dashboard
          </Link>
          <Link
            to="/categories"
            className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-100 w-full"
          >
            Categories
          </Link>
          <Link
            to="/items/auto-add"
            className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-100 w-full"
          >
            Auto Add Item
          </Link>
          <Link
            to="/image-test"
            className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100 w-full"
          >
            Image Test
          </Link>
        </div>
      )}
      {/* Profile (avatar and name) */}
      <div className="flex items-center space-x-2 ml-auto">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              {/* Hide username on mobile, show on sm and up */}
              <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[120px]">
                {user.displayName || user.email}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    Signed in as
                    <div className="font-medium text-gray-900 truncate">
                      {user.displayName || user.email}
                    </div>
                  </div>
                  <Link
                    to="/emulator-test"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="mr-3 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Emulator Test
                  </Link>
                  <Link
                    to="/auth-test"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="mr-3 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Auth Test
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <svg
                      className="mr-3 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
