import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { getCategories, Category } from '../services/categoryService';
import { addItem } from '../services/itemService';
import { Item } from '../types/item';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { StorageService } from '../services/image-processing/storageService';
import { db } from '../config/firebase';

interface FormData {
  name: string;
  category: string;
  manufacturer?: string;
  yearReleased?: number;
  condition: string;
  notes?: string;
  description?: string;
  subCategory?: string;
  value?: number;
  imageUrl?: string;
  tags?: string[];
  imageUrls?: string[];
}

const initialFormData: FormData = {
  name: '',
  category: '',
  manufacturer: '',
  yearReleased: 0,
  condition: 'New',
  notes: '',
  description: '',
  subCategory: '',
  value: 0,
  imageUrl: '',
  tags: [],
  imageUrls: [],
};

const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'];

const AddItem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [tempItemId] = useState(
    () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingUser, setLoadingUser] = useState(true);
  const storageService = new StorageService();

  useEffect(() => {
    if (!user) return;
    setLoadingUser(false);
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories(user.uid);

        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [user]);

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
    setFormData((prev) => {
      return {
        ...prev,
        imageUrl: url,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { imageUrl, tags, imageUrls, ...rest } = formData;
      const newItem: Omit<Item, 'id'> = {
        ...rest,
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        tags: tags || [],
        imageUrls: imageUrls || [],
        ...(imageUrl ? { imageUrl } : {}),
      };

      const itemId = await addItem(user.uid, newItem);
      const newImageUrls = await storageService.moveAllImagesFromTempToPermanent(
        user.uid,
        tempItemId,
        itemId
      );
      const docRef = doc(db, 'users', user.uid, 'items', itemId);
      await updateDoc(docRef, { imageUrls: newImageUrls });
      navigate(`/items/${itemId}`);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || loadingUser) {
    return <div className="flex items-center justify-center h-64">Loading user...</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0 py-6">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add New Item
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-8 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              disabled={loadingCategories}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
            )}
          </div>

          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              id="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            />
          </div>

          <div>
            <label htmlFor="yearReleased" className="block text-sm font-medium text-gray-700">
              Year Released
            </label>
            <input
              type="number"
              name="yearReleased"
              id="yearReleased"
              value={formData.yearReleased || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <ImageGallery itemId={tempItemId} onImageSelect={handleImageSelect} />
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
