import { renderHook, act } from '@testing-library/react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../useCategories';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/category';
import { useAuth } from '../../context/AuthContext';
import { Category } from '../../types/item';
import { QueryClientWrapper } from '../../test-utils/QueryClientWrapper';

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the category service
jest.mock('../../services/category', () => ({
  getCategories: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
}));

describe.skip('useCategories', () => {
  const mockUser = { uid: 'test-user-id' };
  const mockCategories: Category[] = [
    { id: '1', name: 'Books', iconUrl: 'book.png', defaultTags: ['Fiction', 'Non-Fiction'] },
    { id: '2', name: 'LEGO', iconUrl: 'lego.png', defaultTags: ['Star Wars', 'City'] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('fetches categories', async () => {
    (getCategories as jest.Mock).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), {
      wrapper: QueryClientWrapper,
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After loading
    expect(getCategories).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockCategories);
  });

  it('returns empty array if no categories', async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCategories(), {
      wrapper: QueryClientWrapper,
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('handles error state', async () => {
    const error = new Error('Failed to fetch categories');
    (getCategories as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCategories(), {
      wrapper: QueryClientWrapper,
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeUndefined();

    // Wait for error
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });
});

describe.skip('useCreateCategory', () => {
  it('creates a new category', async () => {
    const newCategory: Omit<Category, 'id'> = {
      name: 'New Category',
      iconUrl: 'new-icon.png',
      defaultTags: ['Tag1', 'Tag2'],
    };
    (createCategory as jest.Mock).mockResolvedValue({ id: '3', ...newCategory });

    const { result } = renderHook(() => useCreateCategory());

    await act(async () => {
      await result.current.mutateAsync(newCategory);
    });

    expect(createCategory).toHaveBeenCalledWith(newCategory);
  });
});

describe.skip('useUpdateCategory', () => {
  it('updates an existing category', async () => {
    const categoryId = '1';
    const updates: Partial<Category> = {
      name: 'Updated Category',
      iconUrl: 'updated-icon.png',
      defaultTags: ['NewTag'],
    };
    (updateCategory as jest.Mock).mockResolvedValue({ id: categoryId, ...updates });

    const { result } = renderHook(() => useUpdateCategory());

    await act(async () => {
      await result.current.mutateAsync({ id: categoryId, updates });
    });

    expect(updateCategory).toHaveBeenCalledWith(categoryId, updates);
  });
});

describe.skip('useDeleteCategory', () => {
  it('deletes a category', async () => {
    const categoryId = '1';
    (deleteCategory as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCategory());

    await act(async () => {
      await result.current.mutateAsync(categoryId);
    });

    expect(deleteCategory).toHaveBeenCalledWith(categoryId);
  });
});
