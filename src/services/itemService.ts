import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Item } from '../types/item';

export const getItems = async (userId: string): Promise<Item[]> => {
  try {
    const itemsRef = collection(db, 'users', userId, 'items');
    const q = query(itemsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Item)
    );
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const addItem = async (userId: string, item: Omit<Item, 'id'>): Promise<Item> => {
  try {
    const itemsRef = collection(db, 'users', userId, 'items');
    const docRef = await addDoc(itemsRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...item,
    };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItem = async (
  userId: string,
  itemId: string,
  item: Partial<Item>
): Promise<void> => {
  try {
    const itemRef = doc(db, 'users', userId, 'items', itemId);
    await updateDoc(itemRef, {
      ...item,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (userId: string, itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'users', userId, 'items', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
