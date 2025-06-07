import React, { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useCategories';
import { Category } from '../types/item';

export const CategoryManager: React.FC = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [form, setForm] = useState<Partial<Category>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory.mutate({ id: editingId, updates: form });
      setEditingId(null);
    } else {
      createCategory.mutate(form as Omit<Category, 'id'>);
    }
    setForm({});
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setForm(category);
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Category Manager</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 mb-8 space-y-4"
        data-testid="add-category-form"
      >
        <div className="flex gap-4">
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Category Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="iconUrl"
            value={form.iconUrl || ''}
            onChange={handleChange}
            placeholder="Icon URL"
            className="border p-2 rounded w-full"
          />
        </div>
        <input
          name="defaultTags"
          value={form.defaultTags ? form.defaultTags.join(',') : ''}
          onChange={(e) =>
            setForm({ ...form, defaultTags: e.target.value.split(',').map((t) => t.trim()) })
          }
          placeholder="Default Tags (comma separated)"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={createCategory.status === 'pending' || updateCategory.status === 'pending'}
        >
          {editingId ? 'Update Category' : 'Add Category'}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-4 text-gray-600 underline"
            onClick={() => {
              setEditingId(null);
              setForm({});
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.defaultTags?.join(', ')}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No categories found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
