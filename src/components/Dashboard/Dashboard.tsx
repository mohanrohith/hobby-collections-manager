import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Item } from '../../types/item';
import SearchAndFilter from './SearchAndFilter';
import ItemDetail from '../ItemDetail/ItemDetail';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize the items query
  const itemsQuery = useMemo(() => query(collection(db, 'users', userId, 'items')), [userId]);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      if (!mounted) return;

      const itemsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];

      setItems(itemsList);
      setFilteredItems(itemsList);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [itemsQuery]);

  const handleFilterChange = useCallback((filtered: Item[]) => {
    setFilteredItems(filtered);
  }, []);

  const handleItemClick = useCallback(
    (itemId: string) => {
      navigate(`/items/${itemId}`);
    },
    [navigate]
  );

  // Responsive grid and theme
  const itemsGrid = useMemo(() => {
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-base font-semibold text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="cursor-pointer h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <ItemDetail item={item} />
          </div>
        ))}
      </div>
    );
  }, [filteredItems, handleItemClick]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Sticky header for mobile only, compact, only title */}
      <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-gray-200 block sm:hidden shadow-sm">
        <div className="w-full px-4 flex items-center h-14">
          <h1 className="text-lg font-bold text-gray-900 truncate">My Collection</h1>
        </div>
      </div>

      {/* Main content area, show only on sm and up */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Collection</h1>
          <button
            className="inline-flex items-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/items/new')}
          >
            + Add Item
          </button>
        </div>
        <SearchAndFilter items={items} onFilterChange={handleFilterChange} />
        <div className="bg-white rounded-lg shadow mt-4">
          <div className="px-2 sm:px-6 py-5 sm:p-6">
            <div className="text-sm text-gray-500 mb-4">{filteredItems.length} items found</div>
            {itemsGrid}
          </div>
        </div>
      </div>

      {/* On mobile, show SearchAndFilter and grid below sticky header */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 block sm:hidden">
        <SearchAndFilter items={items} onFilterChange={handleFilterChange} />
        <div className="bg-white rounded-lg shadow">
          <div className="px-2 sm:px-6 py-5 sm:p-6">
            <div className="text-sm text-gray-500 mb-4">{filteredItems.length} items found</div>
            {itemsGrid}
          </div>
        </div>
      </div>

      {/* Floating Add Item button for mobile (only this on mobile) */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-colors duration-200 sm:hidden"
        onClick={() => navigate('/items/new')}
        aria-label="Add Item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
        </svg>
      </button>
    </div>
  );
};

export default React.memo(Dashboard);
