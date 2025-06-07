// Firebase project configuration file
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { validateEnv } from './validateEnv';

validateEnv();

const firebaseConfig = {
  apiKey: process.env['REACT_APP_FIREBASE_API_KEY'] as string,
  authDomain: process.env['REACT_APP_FIREBASE_AUTH_DOMAIN'] as string,
  projectId: process.env['REACT_APP_FIREBASE_PROJECT_ID'] as string,
  storageBucket: process.env['REACT_APP_FIREBASE_STORAGE_BUCKET'] as string,
  messagingSenderId: process.env['REACT_APP_FIREBASE_MESSAGING_SENDER_ID'] as string,
  appId: process.env['REACT_APP_FIREBASE_APP_ID'] as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
