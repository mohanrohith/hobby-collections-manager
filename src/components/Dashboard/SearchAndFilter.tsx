import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Item } from '../../types/item';
import { Timestamp } from 'firebase/firestore';

interface SearchAndFilterProps {
  items: Item[];
  onFilterChange: (filtered: Item[]) => void;
}

interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: 'name' | 'createdAt' | 'yearReleased';
  sortOrder: 'asc' | 'desc';
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ items, onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    selectedTags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Get unique categories and tags
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const allTags = items.flatMap((item) => item.tags);
  const uniqueTags = Array.from(new Set(allTags));

  useEffect(() => {
    let filtered = [...items];

    // Apply search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.manufacturer?.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.selectedCategory) {
      filtered = filtered.filter((item) => item.category === filters.selectedCategory);
    }

    // Apply tag filters
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        filters.selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      let dateA: Date;
      let dateB: Date;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'yearReleased':
          comparison = (a.yearReleased || 0) - (b.yearReleased || 0);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    onFilterChange(filtered);
  }, [filters, items, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: prev.selectedCategory === category ? null : category,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: null,
      selectedTags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search items..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
        <button
          onClick={toggleSortOrder}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'} Sort
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Clear all
            </button>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filters.selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filters.selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="name">Name</option>
              <option value="createdAt">Date Added</option>
              <option value="yearReleased">Year Released</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(filters.selectedCategory || filters.selectedTags.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {filters.selectedCategory}
              <button
                onClick={() => handleCategoryChange(filters.selectedCategory!)}
                className="ml-2 inline-flex text-indigo-600 hover:text-indigo-900"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
          {filters.selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-2 inline-flex text-indigo-600 hover:text-indigo-900"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
