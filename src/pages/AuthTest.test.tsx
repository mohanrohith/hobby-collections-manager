import { render, screen } from '@testing-library/react';
import { AuthTest } from './AuthTest';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useUserProfile
jest.mock('../hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    profile: null,
    loading: false,
    updateProfile: jest.fn(),
    updatePreferences: jest.fn(),
  }),
}));

describe.skip('AuthTest', () => {
  it('renders AuthTest page with sign up and sign in forms', () => {
    render(<AuthTest />);
    // There should be two email fields (sign up and sign in)
    expect(screen.getAllByLabelText(/email/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });
});
