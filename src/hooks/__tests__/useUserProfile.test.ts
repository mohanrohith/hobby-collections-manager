import { renderHook, act } from '@testing-library/react';
import { useUserProfile } from '../useUserProfile';
import { userProfileService } from '../../services/userProfile';
import { QueryClientWrapper } from '../../test-utils/QueryClientWrapper';

jest.mock('../../services/userProfile', () => ({
  userProfileService: {
    getProfile: jest.fn(),
    createProfile: jest.fn(),
    updateProfile: jest.fn(),
    updatePreferences: jest.fn(),
    updateSettings: jest.fn(),
  },
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'u', email: 'test@example.com', displayName: 'Test User' } }),
}));

describe.skip('useUserProfile', () => {
  const mockProfile = {
    uid: 'u',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: { theme: 'light', itemsPerPage: 20, defaultCollectionType: null },
    settings: { emailNotifications: true, showValueEstimates: true, autoSync: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user profile', async () => {
    (userProfileService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useUserProfile(), { wrapper: QueryClientWrapper });

    // Wait for the initial state
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(userProfileService.getProfile).toHaveBeenCalledWith('u');
    expect(result.current.profile).toMatchObject({
      uid: 'u',
      email: 'test@example.com',
      displayName: 'Test User',
    });
  });

  it('handles error when fetching profile', async () => {
    const error = new Error('Failed to fetch profile');
    (userProfileService.getProfile as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useUserProfile(), { wrapper: QueryClientWrapper });

    // Wait for the error state
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.profile).toBeNull();
  });
});
