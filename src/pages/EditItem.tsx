import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Item } from '../types/item';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { StorageService } from '../services/image-processing/storageService';

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    category: '',
    description: '',
    condition: '',
    tags: [],
    notes: '',
    subCategory: '',
    manufacturer: '',
    yearReleased: 0,
    value: 0,
    imageUrls: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const storageService = new StorageService();

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

        const itemData = itemSnap.data() as Item;
        setFormData({
          name: itemData.name,
          category: itemData.category,
          description: itemData.description || '',
          condition: itemData.condition || '',
          tags: itemData.tags || [],
          notes: itemData.notes || '',
          subCategory: itemData.subCategory || '',
          manufacturer: itemData.manufacturer || '',
          yearReleased: itemData.yearReleased || 0,
          value: itemData.value || 0,
          imageUrls: itemData.imageUrls || [],
        });
      } catch (err) {
        setError('Error loading item');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [user, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (url: string) => {
    if ((formData.imageUrls || []).includes(url)) {
      // If clicking the already selected image, do nothing
      return;
    }
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls || []), url],
    }));
  };

  const handleImageDelete = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter((imgUrl) => imgUrl !== url),
    }));
    setDeletedImageUrls((prev) => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setIsSaving(true);
    try {
      // Delete images marked for deletion
      for (const url of deletedImageUrls) {
        await storageService.deleteImage(url);
      }
      const itemRef = doc(db, 'users', user.uid, 'items', id);
      await updateDoc(itemRef, {
        ...formData,
        updatedAt: new Date(),
        imageUrls: (formData.imageUrls || []).filter((url) => !!url),
      });
      navigate(`/items/${id}`);
    } catch (err) {
      setError('Error updating item');
      console.error('Error updating item:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
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
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(`/items/${id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Item
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <input
              type="text"
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="yearReleased" className="block text-sm font-medium text-gray-700">
              Year Released
            </label>
            <input
              type="number"
              id="yearReleased"
              name="yearReleased"
              value={formData.yearReleased || ''}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <input
              type="text"
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value.split(',').map((tag) => tag.trim());
                setFormData((prev) => ({ ...prev, tags }));
              }}
              placeholder="Enter tags separated by commas"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Images</h3>
              <p className="text-sm text-gray-500">Upload or select an image from the gallery</p>
            </div>
            {user && id && (
              <ImageGallery
                itemId={id}
                userId={user.uid}
                onImageSelect={handleImageSelect}
                selectedImageUrls={formData.imageUrls || []}
                onImagesChange={(urls) => setFormData((prev) => ({ ...prev, imageUrls: urls }))}
                onImageDelete={handleImageDelete}
              />
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/items/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
