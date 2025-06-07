import { createCategory, getCategories, updateCategory, deleteCategory } from './category';
import { addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe.skip('category service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createCategory adds a category', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'cat1' });
    const category = { name: 'Books', iconUrl: '', defaultTags: ['Hardcover'] };
    const id = await createCategory(category);
    expect(addDoc).toHaveBeenCalled();
    expect(id).toBe('cat1');
  });

  it('getCategories fetches categories', async () => {
    const mockDocs = [
      { id: 'cat1', data: () => ({ name: 'Books', iconUrl: '', defaultTags: ['Hardcover'] }) },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });
    const categories = await getCategories();
    expect(getDocs).toHaveBeenCalled();
    expect(categories).toEqual([
      { id: 'cat1', name: 'Books', iconUrl: '', defaultTags: ['Hardcover'] },
    ]);
  });

  it('updateCategory updates a category', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await updateCategory('cat1', { name: 'Updated' });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('deleteCategory deletes a category', async () => {
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    await deleteCategory('cat1');
    expect(deleteDoc).toHaveBeenCalled();
  });
});
