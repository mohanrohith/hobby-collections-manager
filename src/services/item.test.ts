import { getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getItems, addItem, updateItem, deleteItem } from './itemService';
import { Item } from '../types/item';
import { Timestamp } from 'firebase/firestore';

jest.mock('firebase/firestore', () => {
  const actual = jest.requireActual('firebase/firestore');
  return {
    ...actual,
    Timestamp: actual.Timestamp,
  };
});

describe.skip('Item Service', () => {
  const mockItem: Omit<Item, 'id'> = {
    name: 'Test Item',
    category: 'Test Category',
    userId: 'test-user',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    tags: [],
    imageUrl: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get items', async () => {
    const mockDocs = [
      { id: '1', data: () => mockItem },
      { id: '2', data: () => mockItem },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

    const items = await getItems('test-user');
    expect(items).toHaveLength(2);
    if (items.length >= 2) {
      expect(items[0]!.id).toBe('1');
      expect(items[1]!.id).toBe('2');
    }
  });

  it('should add an item', async () => {
    const mockDocRef = { id: '1' };
    (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

    const newItem = await addItem('test-user', mockItem);
    expect(newItem).toBe('1');
    expect(addDoc).toHaveBeenCalled();
  });

  it('should update an item', async () => {
    await updateItem('test-user', '1', { name: 'Updated Item' });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('should delete an item', async () => {
    await deleteItem('test-user', '1');
    expect(deleteDoc).toHaveBeenCalled();
  });
});
