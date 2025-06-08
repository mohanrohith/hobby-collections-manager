import React from 'react';

export type Category = 'LEGO' | 'Funko Pop' | 'Diecast Cars' | 'Books' | string;

interface CategorySelectorProps {
  selectedCategory: Category | undefined;
  onCategoryChange: (category: Category | undefined) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  className = '',
}) => {
  const predefinedCategories: Category[] = ['LEGO', 'Funko Pop', 'Diecast Cars', 'Books'];

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Select Category
      </label>
      <select
        id="category"
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || undefined)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Select a category...</option>
        {predefinedCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value="other">Other (Custom)</option>
      </select>
      {selectedCategory === 'other' && (
        <input
          type="text"
          placeholder="Enter custom category"
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
      )}
    </div>
  );
};
