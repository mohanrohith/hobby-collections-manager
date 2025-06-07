import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Category,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Categories: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    subCategories: [],
    defaultTags: [],
    createdAt: null,
    updatedAt: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;

      try {
        const fetchedCategories = await getCategories(user.uid);
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  const handleAddCategory = async () => {
    if (!user) return;
    try {
      await addCategory(user.uid, newCategory);
      // Refetch categories after adding
      const updatedCategories = await getCategories(user.uid);
      setCategories(updatedCategories);
      setNewCategory({
        name: '',
        subCategories: [],
        defaultTags: [],
        createdAt: null,
        updatedAt: null,
      });
    } catch (err) {
      setError('Failed to add category');
      console.error(err);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    if (!user || !category.id) return;

    try {
      await updateCategory(user.uid, category.id, category);
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
      setEditingCategory(null);
    } catch (err) {
      setError('Failed to update category');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;

    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategory(user.uid, categoryId);
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Add New Category Form */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subcategories (comma-separated)
            </label>
            <input
              type="text"
              value={newCategory.subCategories.join(', ')}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  subCategories: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Tags (comma-separated)
            </label>
            <input
              type="text"
              value={newCategory.defaultTags.join(', ')}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  defaultTags: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-4">
            {editingCategory?.id === category.id && editingCategory ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      subCategories: editingCategory.subCategories,
                      defaultTags: editingCategory.defaultTags,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editingCategory.subCategories.join(', ')}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: editingCategory.name,
                      subCategories: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                      defaultTags: editingCategory.defaultTags,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editingCategory.defaultTags.join(', ')}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: editingCategory.name,
                      subCategories: editingCategory.subCategories,
                      defaultTags: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateCategory(editingCategory)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-500">Subcategories</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {category.subCategories.map((sub, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-500">Default Tags</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {category.defaultTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => category.id && handleDeleteCategory(category.id)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full text-gray-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
