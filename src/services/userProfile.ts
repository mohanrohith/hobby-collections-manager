import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AuthUser } from './auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    itemsPerPage: number;
    defaultCollectionType: string | null;
  };
  settings: {
    emailNotifications: boolean;
    showValueEstimates: boolean;
    autoSync: boolean;
  };
}

const DEFAULT_PREFERENCES = {
  theme: 'light' as const,
  itemsPerPage: 20,
  defaultCollectionType: null,
};

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  showValueEstimates: true,
  autoSync: true,
};

export const userProfileService = {
  // Create a new user profile
  async createProfile(user: AuthUser): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: DEFAULT_PREFERENCES,
      settings: DEFAULT_SETTINGS,
    };

    try {
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update user preferences
  async updatePreferences(
    uid: string,
    preferences: Partial<UserProfile['preferences']>
  ): Promise<void> {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, {
        preferences: {
          ...DEFAULT_PREFERENCES,
          ...preferences,
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // Update user settings
  async updateSettings(uid: string, settings: Partial<UserProfile['settings']>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, {
        settings: {
          ...DEFAULT_SETTINGS,
          ...settings,
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },
};
