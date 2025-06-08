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
import { StorageService } from '../services/image-processing/storageService';

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

export const addItem = async (userId: string, item: Omit<Item, 'id'>): Promise<string> => {
  try {
    const itemsRef = collection(db, 'users', userId, 'items');
    const docRef = await addDoc(itemsRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // If the item has a temporary image, move it to the permanent location
    if (item.imageUrl && item.imageUrl.includes('/temp/')) {
      const storageService = new StorageService();
      const filename = item.imageUrl.split('/').pop();
      if (filename) {
        const newPath = `users/${userId}/items/${docRef.id}/${filename}`;
        const oldPath = item.imageUrl.split('/').slice(-3).join('/');

        await storageService.moveImage(oldPath, newPath);

        // Update the imageUrl in Firestore with the new permanent path
        let newImageUrl;
        if (process.env.NODE_ENV === 'development') {
          // In development, use the emulator URL
          newImageUrl = `http://localhost:9199/v0/b/${
            process.env['REACT_APP_FIREBASE_STORAGE_BUCKET']
          }/o/${encodeURIComponent(newPath)}`;
        } else {
          // In production, use the Firebase Storage URL
          newImageUrl = `https://storage.googleapis.com/${
            process.env['REACT_APP_FIREBASE_STORAGE_BUCKET']
          }/${encodeURIComponent(newPath)}`;
        }

        await updateDoc(docRef, { imageUrl: newImageUrl });
      }
    }

    return docRef.id;
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
