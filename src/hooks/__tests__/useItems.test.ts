import { renderHook, act } from '@testing-library/react';
import { useItems } from '../useItems';
import { getItems } from '../../services/item';
import { useAuth } from '../../context/AuthContext';

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the item service
jest.mock('../../services/item', () => ({
  getItems: jest.fn(),
}));

describe.skip('useItems', () => {
  const mockUser = { uid: 'u' };
  const mockItems = [
    {
      id: '1',
      name: 'Item 1',
      category: 'Books',
      dateAdded: '2024-01-01',
      dateModified: '2024-01-01',
    },
    {
      id: '2',
      name: 'Item 2',
      category: 'LEGO',
      dateAdded: '2024-01-02',
      dateModified: '2024-01-02',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('fetches items', async () => {
    (getItems as jest.Mock).mockResolvedValue(mockItems);

    const { result } = renderHook(() => useItems(mockUser.uid));

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After loading
    expect(getItems).toHaveBeenCalledWith('u');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockItems);
  });

  it('returns empty array if no items', async () => {
    (getItems as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useItems(mockUser.uid));

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
    const error = new Error('Failed to fetch items');
    (getItems as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useItems(mockUser.uid));

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
