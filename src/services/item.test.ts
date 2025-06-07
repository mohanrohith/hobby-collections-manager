import { getItems, createItem, updateItem, deleteItem } from './item';
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe.skip('item service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getItems fetches items', async () => {
    const mockDocs = [
      {
        id: '1',
        data: () => ({ name: 'Test', dateAdded: '', dateModified: '', userId: 'u', category: 'c' }),
      },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });
    const items = await getItems('u');
    expect(collection).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(items).toEqual([
      { id: '1', name: 'Test', dateAdded: '', dateModified: '', userId: 'u', category: 'c' },
    ]);
  });

  it('createItem adds an item', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: '2' });
    const item = { name: 'New', dateAdded: '', dateModified: '', userId: 'u', category: 'c' };
    const result = await createItem('u', item);
    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual({ id: '2', ...item });
  });

  it('updateItem updates an item', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await updateItem('u', '1', { name: 'Updated' });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('deleteItem deletes an item', async () => {
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    await deleteItem('u', '1');
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('getItems returns empty array if no docs', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    const items = await getItems('u');
    expect(items).toEqual([]);
  });
});
