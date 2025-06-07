import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Category } from '../types/item';

const categoriesCollection = collection(db, 'categories');

export async function createCategory(category: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(categoriesCollection, category);
  return docRef.id;
}

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Category));
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const categoryRef = doc(db, 'categories', id);
  await updateDoc(categoryRef, updates);
}

export async function deleteCategory(id: string): Promise<void> {
  const categoryRef = doc(db, 'categories', id);
  await deleteDoc(categoryRef);
}
