import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Category {
  id: string;
  name: string;
  subCategories: string[];
  defaultTags: string[];
  createdAt: any;
  updatedAt: any;
}

export const getCategories = async (userId: string): Promise<Category[]> => {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const q = query(categoriesRef, orderBy('name'));
  const snapshot = await getDocs(q);
  const categories = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as Category;
  });
  return categories;
};

export const addCategory = async (
  userId: string,
  category: Omit<Category, 'id'>
): Promise<void> => {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  await addDoc(categoriesRef, {
    ...category,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateCategory = async (
  userId: string,
  categoryId: string,
  category: Partial<Category>
): Promise<void> => {
  const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
  await updateDoc(categoryRef, {
    ...category,
    updatedAt: new Date(),
  });
};

export const deleteCategory = async (userId: string, categoryId: string): Promise<void> => {
  const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
  await deleteDoc(categoryRef);
};
