import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Item } from '../types/item';

export const getItems = async (userId: string): Promise<Item[]> => {
  const itemsRef = collection(db, 'users', userId, 'items');
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
};

export const createItem = async (userId: string, item: Omit<Item, 'id'>): Promise<Item> => {
  const itemsRef = collection(db, 'users', userId, 'items');
  const docRef = await addDoc(itemsRef, item);
  return { id: docRef.id, ...item };
};

export const updateItem = async (
  userId: string,
  itemId: string,
  updates: Partial<Item>
): Promise<void> => {
  const itemRef = doc(db, 'users', userId, 'items', itemId);
  await updateDoc(itemRef, updates);
};

export const deleteItem = async (userId: string, itemId: string): Promise<void> => {
  const itemRef = doc(db, 'users', userId, 'items', itemId);
  await deleteDoc(itemRef);
};
