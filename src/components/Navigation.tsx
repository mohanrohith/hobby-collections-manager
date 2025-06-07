import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`hover:text-gray-300 transition-colors duration-200 ${
              isActive('/') ? 'text-blue-400' : ''
            }`}
          >
            Items
          </Link>
          <Link
            to="/categories"
            className={`hover:text-gray-300 transition-colors duration-200 ${
              isActive('/categories') ? 'text-blue-400' : ''
            }`}
          >
            Categories
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            More
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-10 transform transition-transform duration-200 ease-in-out">
              <Link
                to="/emulator-test"
                className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                  isActive('/emulator-test') ? 'text-blue-400' : ''
                }`}
              >
                Emulator Test
              </Link>
              <Link
                to="/auth-test"
                className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                  isActive('/auth-test') ? 'text-blue-400' : ''
                }`}
              >
                Auth Test
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
