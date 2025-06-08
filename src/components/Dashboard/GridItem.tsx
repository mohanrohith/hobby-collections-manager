import React, { useState } from 'react';
import { Item } from '../../types/item';

interface GridItemProps {
  item: Item;
  onClick?: () => void;
}

const GridItem: React.FC<GridItemProps> = ({ item, onClick }) => {
  const [current, setCurrent] = useState(0);
  const images =
    item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls
      : item.imageUrl
      ? [item.imageUrl]
      : [];
  const showArrows = images.length > 1;
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {images.length > 0 && (
        <div className="relative aspect-w-1 aspect-h-1 bg-gray-100">
          <img
            src={images[current]}
            alt={item.name}
            className="w-full h-48 object-cover rounded-t-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {showArrows && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-90"
                aria-label="Previous image"
              >
                &#8592;
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-90"
                aria-label="Next image"
              >
                &#8594;
              </button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  idx === current ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(idx);
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        {item.condition && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            {item.condition}
          </span>
        )}
      </div>
    </div>
  );
};

export default GridItem;
