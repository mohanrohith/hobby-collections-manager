import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const AuthTest: React.FC = () => {
  const { user, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, updatePreferences } = useUserProfile();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, displayName);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    try {
      await updateProfile({ displayName });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleUpdatePreferences = async () => {
    if (!profile) return;
    try {
      await updatePreferences({ theme: profile.preferences.theme === 'light' ? 'dark' : 'light' });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  if (profileLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!user ? (
        <div className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-2">
            <h2 className="text-xl font-semibold">Sign Up</h2>
            <label htmlFor="signup-email" className="block">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            <label htmlFor="signup-password" className="block">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            <label htmlFor="signup-displayName" className="block">
              Display Name
            </label>
            <input
              id="signup-displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              className="border p-2 rounded w-full"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign Up
            </button>
          </form>

          <form onSubmit={handleSignIn} className="space-y-2">
            <h2 className="text-xl font-semibold">Sign In</h2>
            <label htmlFor="signin-email" className="block">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            <label htmlFor="signin-password" className="block">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
          </form>

          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p>Email: {user.email}</p>
            <p>Display Name: {profile?.displayName}</p>
            <p>Theme: {profile?.preferences.theme}</p>
            <p>Items per page: {profile?.preferences.itemsPerPage}</p>
            <p>
              Email notifications: {profile?.settings.emailNotifications ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="New Display Name"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Profile
            </button>
          </div>

          <button
            onClick={handleUpdatePreferences}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Toggle Theme
          </button>

          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
