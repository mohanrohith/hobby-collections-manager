import type { User } from 'firebase/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthError extends Error {
  code?: string;
  message: string;
}

const auth = getAuth();

export const authService = {
  // Email/Password Sign Up
  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign up');
    }
  },

  // Email/Password Sign In
  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign in');
    }
  },

  // Google Sign In
  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign in with Google');
    }
  },

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign out');
    }
  },

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to reset password');
    }
  },

  // Update User Profile
  async updateUserProfile(
    user: User,
    data: { displayName?: string; photoURL?: string }
  ): Promise<void> {
    try {
      await updateProfile(user, data);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to update profile');
    }
  },

  // Convert Firebase User to AuthUser
  convertUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },

  // Error Handler
  handleAuthError(error: Error | { code?: string; message?: string }): AuthError {
    console.error('Auth Error:', error);
    const errorCode = 'code' in error ? error.code : 'unknown';
    const errorMessage = error.message || 'An unknown error occurred';
    return {
      name: 'AuthError',
      code: errorCode,
      message: errorMessage,
    };
  },

  handleError(error: Error) {
    throw error;
  },
};
