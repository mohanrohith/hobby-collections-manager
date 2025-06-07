import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const DEFAULT_CATEGORIES = [
  {
    name: 'Books',
    subCategories: ['Fiction', 'Non-Fiction', 'Comics'],
    defaultTags: ['Hardcover', 'Paperback', 'Signed'],
  },
  {
    name: 'LEGO',
    subCategories: ['Technic', 'City', 'Star Wars'],
    defaultTags: ['Set', 'Minifigure', 'Boxed'],
  },
  {
    name: 'Funko Pops',
    subCategories: ['Marvel', 'Disney', 'Anime'],
    defaultTags: ['Chase', 'Exclusive', 'Vaulted'],
  },
  {
    name: 'Diecast Cars',
    subCategories: ['1:18', '1:24', '1:64'],
    defaultTags: ['Limited Edition', 'Vintage', 'Boxed'],
  },
  {
    name: 'Hot Wheels',
    subCategories: ['Mainline', 'Premium', 'Treasure Hunt'],
    defaultTags: ['Redline', 'Super Treasure Hunt', 'Collector'],
  },
];

export async function seedCategories(userId: string) {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const existing = await getDocs(categoriesRef);
  if (!existing.empty) {
    return;
  }
  for (const cat of DEFAULT_CATEGORIES) {
    const data = {
      ...cat,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await addDoc(categoriesRef, data);
  }
  // Verify (optional, can be removed if not needed)
  // const after = await getDocs(categoriesRef);
}
