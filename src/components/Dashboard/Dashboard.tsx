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

  // Memoize the items grid to prevent unnecessary re-renders
  const itemsGrid = useMemo(() => {
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndFilter items={items} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-sm text-gray-500 mb-4">{filteredItems.length} items found</div>
          {itemsGrid}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
