import { userProfileService } from './userProfile';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: () => 'timestamp',
}));

describe.skip('userProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProfile fetches user profile', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        uid: 'u',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: '',
        createdAt: { toDate: () => new Date('2020-01-01') },
        updatedAt: { toDate: () => new Date('2020-01-02') },
        preferences: { theme: 'light', itemsPerPage: 20, defaultCollectionType: null },
        settings: { emailNotifications: true, showValueEstimates: true, autoSync: true },
      }),
    });
    const profile = await userProfileService.getProfile('u');
    expect(getDoc).toHaveBeenCalled();
    expect(profile).toMatchObject({
      uid: 'u',
      email: 'test@example.com',
      displayName: 'Test User',
    });
  });

  it('createProfile creates a user profile', async () => {
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    await userProfileService.createProfile({
      uid: 'u',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: '',
    });
    expect(setDoc).toHaveBeenCalled();
  });

  it('updateProfile updates a user profile', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await userProfileService.updateProfile('u', { displayName: 'Updated' });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('updatePreferences updates user preferences', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await userProfileService.updatePreferences('u', { theme: 'dark' });
    expect(updateDoc).toHaveBeenCalled();
  });

  it('updateSettings updates user settings', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await userProfileService.updateSettings('u', { autoSync: false });
    expect(updateDoc).toHaveBeenCalled();
  });
});
