import { authService, AuthError } from './auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';

describe.skip('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signUp creates a user and updates profile', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'u', email: 'e', displayName: null },
    });
    (updateProfile as jest.Mock).mockResolvedValue(undefined);
    await expect(authService.signUp('e', 'p', 'd')).resolves.toBeUndefined();
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(updateProfile).toHaveBeenCalled();
  });

  it('signIn signs in a user', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(undefined);
    await expect(authService.signIn('e', 'p')).resolves.toBeUndefined();
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it('signInWithGoogle signs in with Google', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue(undefined);
    await expect(authService.signInWithGoogle()).resolves.toBeUndefined();
    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('signOut signs out the user', async () => {
    (fbSignOut as jest.Mock).mockResolvedValue(undefined);
    await expect(authService.signOut()).resolves.toBeUndefined();
    expect(fbSignOut).toHaveBeenCalled();
  });

  it('resetPassword sends a reset email', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
    await expect(authService.resetPassword('e')).resolves.toBeUndefined();
    expect(sendPasswordResetEmail).toHaveBeenCalled();
  });

  it('updateUserProfile updates user profile', async () => {
    (updateProfile as jest.Mock).mockResolvedValue(undefined);
    const user = { uid: 'u', email: 'e', displayName: 'd' } as User;
    await expect(
      authService.updateUserProfile(user, { displayName: 'new' })
    ).resolves.toBeUndefined();
    expect(updateProfile).toHaveBeenCalled();
  });

  it('convertUser returns AuthUser', () => {
    const user = { uid: 'u', email: 'e', displayName: 'd', photoURL: 'p' } as User;
    expect(authService.convertUser(user)).toEqual({
      uid: 'u',
      email: 'e',
      displayName: 'd',
      photoURL: 'p',
    });
  });

  it('handleAuthError returns AuthError', () => {
    const error = { code: 'x', message: 'fail' };
    const result = authService.handleAuthError(error);
    expect(result).toMatchObject({ code: 'x', message: 'fail', name: 'AuthError' });
  });

  it('handles auth errors correctly', () => {
    const error = {
      code: 'x',
      message: 'fail',
      name: 'FirebaseError',
    } as AuthError;
    const result = authService.handleAuthError(error);
    expect(result).toEqual({
      name: 'AuthError',
      code: 'x',
      message: 'fail',
    });
  });

  it('handles unknown errors correctly', () => {
    const error = new Error('Unknown error');
    const result = authService.handleAuthError(error);
    expect(result).toEqual({
      name: 'AuthError',
      code: 'unknown',
      message: 'Unknown error',
    });
  });
});

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));
