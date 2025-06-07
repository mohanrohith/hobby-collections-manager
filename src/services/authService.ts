import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  User,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { seedCategories } from '../utils/seedCategories';
import { Timestamp } from 'firebase/firestore';

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    email: user.email,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  await seedCategories(user.uid);
  return userCredential;
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const signInWithGoogle = async () => {
  const authInstance = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authInstance, provider);
  const user = result.user;
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      email: user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    await seedCategories(user.uid);
  }
  return user;
};

export const logout = async () => {
  await signOut();
};
