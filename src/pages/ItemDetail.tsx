import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Item } from '../types/item';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images =
    item?.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls
      : item?.imageUrl
      ? [item.imageUrl]
      : [];
  const showArrows = images.length > 1;
  const goPrev = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !user) return;

      try {
        const itemRef = doc(db, 'users', user.uid, 'items', id);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          const itemData = { id: itemSnap.id, ...itemSnap.data() } as Item;
          setItem(itemData);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();

    // Set up a listener for real-time updates
    let unsubscribe: (() => void) | undefined;
    if (id && user) {
      const itemRef = doc(db, 'users', user.uid, 'items', id);
      unsubscribe = onSnapshot(itemRef, (doc) => {
        if (doc.exists()) {
          const itemData = { id: doc.id, ...doc.data() } as Item;
          setItem(itemData);
        }
      });
    }

    // Return cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id, user]);

  const handleDelete = async () => {
    if (!user || !id || !window.confirm('Are you sure you want to delete this item?')) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'items', id));
      navigate('/dashboard');
    } catch (err) {
      setError('Error deleting item');
      console.error('Error deleting item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Item not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {images.length > 0 && (
          <div className="w-full flex justify-center py-8 relative">
            <img
              src={images[currentImage]}
              alt={`Item image ${currentImage + 1}`}
              className="h-80 object-contain rounded-lg bg-white shadow"
            />
            {showArrows && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-90"
                  aria-label="Previous image"
                >
                  &#8592;
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-90"
                  aria-label="Next image"
                >
                  &#8594;
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-2 h-2 rounded-full ${
                    idx === currentImage ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{item.category}</dd>
                </div>
                {item.subCategory && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subcategory</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.subCategory}</dd>
                  </div>
                )}
                {item.manufacturer && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.manufacturer}</dd>
                  </div>
                )}
                {item.yearReleased && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Year Released</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.yearReleased}</dd>
                  </div>
                )}
                {item.condition && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Condition</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.condition}</dd>
                  </div>
                )}
                {item.value && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Value</dt>
                    <dd className="mt-1 text-sm text-gray-900">${item.value.toFixed(2)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              {item.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{item.description}</p>
                </div>
              )}
              {item.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-sm text-gray-900">{item.notes}</p>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {item.createdAt ? (
                <p>Added on {item.createdAt.toDate().toLocaleDateString()}</p>
              ) : (
                <p>Added date not available</p>
              )}
              {item.updatedAt ? (
                <p>Last updated on {item.updatedAt.toDate().toLocaleDateString()}</p>
              ) : (
                <p>Last updated date not available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/items/${id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
