import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userProfileService, type UserProfile } from '../services/userProfile';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await userProfileService.getProfile(user.uid);
        if (!userProfile) {
          // Create profile if it doesn't exist
          await userProfileService.createProfile(user);
          const newProfile = await userProfileService.getProfile(user.uid);
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userProfileService.updateProfile(user.uid, data);
      const updatedProfile = await userProfileService.getProfile(user.uid);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    }
  };

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userProfileService.updatePreferences(user.uid, preferences);
      const updatedProfile = await userProfileService.getProfile(user.uid);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    }
  };

  const updateSettings = async (settings: Partial<UserProfile['settings']>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userProfileService.updateSettings(user.uid, settings);
      const updatedProfile = await userProfileService.getProfile(user.uid);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update settings'));
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    updateSettings,
  };
};
