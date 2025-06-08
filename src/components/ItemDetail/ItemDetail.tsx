import React from 'react';
import { Item } from '../../types/item';

interface ItemDetailProps {
  item: Item;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            {item.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{item.manufacturer}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {item.category}
        </span>
      </div>

      {item.imageUrl && (
        <div className="mt-4 relative group">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-64 object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg" />
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Year Released</h3>
          <p className="mt-1 text-sm text-gray-900">{item.yearReleased}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Condition</h3>
          <p className="mt-1 text-sm text-gray-900">{item.condition}</p>
        </div>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={`${item.id}-tag-${tag}-${index}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.notes && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500">Notes</h3>
          <p className="mt-1 text-sm text-gray-900">{item.notes}</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(ItemDetail);
