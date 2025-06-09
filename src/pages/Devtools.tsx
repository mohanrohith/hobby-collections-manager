import React from 'react';
import { Link } from 'react-router-dom';

const Devtools: React.FC = () => {
  const tools = [
    {
      title: 'Auto Add Item',
      description: 'Test the automated item addition system with image analysis',
      path: '/items/auto-add',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      title: 'Image Test',
      description: 'Test image upload, processing, and analysis features',
      path: '/image-test',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Emulator Test',
      description: 'Test Firebase emulator connections and functionality',
      path: '/emulator-test',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Developer Tools</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access development and testing tools for debugging and verifying application
          functionality. These tools are intended for development purposes only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
                  {tool.icon}
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {tool.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Open Tool
                <svg
                  className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Devtools;
