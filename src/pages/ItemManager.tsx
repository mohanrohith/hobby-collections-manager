import React, { useState } from 'react';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '../hooks/useItems';
import { Item } from '../types/item';

// For demo, use a hardcoded userId. Replace with actual user context in real app.
const userId = 'demo-user';

export const ItemManager: React.FC = () => {
  const { data: items, isLoading } = useItems(userId);
  const createItem = useCreateItem(userId);
  const updateItem = useUpdateItem(userId);
  const deleteItem = useDeleteItem(userId);

  const [form, setForm] = useState<Partial<Item>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItem.mutate({ id: editingId, updates: form });
      setEditingId(null);
    } else {
      const now = new Date().toISOString();
      createItem.mutate({
        ...form,
        dateAdded: now,
        dateModified: now,
      } as Omit<Item, 'id'>);
    }
    setForm({});
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setForm(item);
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Item Manager</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="category"
            value={form.category || ''}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            name="manufacturer"
            value={form.manufacturer || ''}
            onChange={handleChange}
            placeholder="Manufacturer"
            className="border p-2 rounded w-full"
          />
          <input
            name="yearReleased"
            type="number"
            value={form.yearReleased || ''}
            onChange={handleChange}
            placeholder="Year"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="tags"
            value={form.tags ? form.tags.join(',') : ''}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })
            }
            placeholder="Tags (comma separated)"
            className="border p-2 rounded w-full"
          />
          <input
            name="condition"
            value={form.condition || ''}
            onChange={handleChange}
            placeholder="Condition"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="notes"
            value={form.notes || ''}
            onChange={handleChange}
            placeholder="Notes"
            className="border p-2 rounded w-full"
          />
          <select
            name="status"
            value={form.status || ''}
            onChange={handleSelectChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Status</option>
            <option value="Owned">Owned</option>
            <option value="Wishlist">Wishlist</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={createItem.status === 'pending' || updateItem.status === 'pending'}
        >
          {editingId ? 'Update Item' : 'Add Item'}
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
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <li key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category} | {item.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No items found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
