import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchItem = async () => {
      if (!user || !id) return;

      try {
        const itemRef = doc(db, 'users', user.uid, 'items', id);
        const itemSnap = await getDoc(itemRef);

        if (!itemSnap.exists()) {
          setError('Item not found');
          return;
        }

        setItem({ id: itemSnap.id, ...itemSnap.data() } as Item);
      } catch (err) {
        setError('Error loading item');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [user, id]);

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Item not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </div>

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
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-sm text-gray-900">{item.description}</p>
                  </div>
                )}
                {item.notes && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                    <p className="text-sm text-gray-900">{item.notes}</p>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                <p>Added on {item.createdAt.toDate().toLocaleDateString()}</p>
                <p>Last updated on {item.updatedAt.toDate().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
