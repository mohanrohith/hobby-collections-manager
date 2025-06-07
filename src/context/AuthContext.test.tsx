import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { getAuth } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    callback(null);
    return function noop() {
      /* no-op */
    };
  }),
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock Firebase config
jest.mock('../config/firebase', () => ({
  db: {},
}));

describe.skip('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({});
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });
  });

  it('renders children when not loading', async () => {
    const TestChild = () => <div>Test Child</div>;

    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  it('does not render children while loading', () => {
    const TestChild = () => <div>Test Child</div>;

    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );

    // Children should not be visible during loading
    expect(screen.queryByText('Test Child')).not.toBeInTheDocument();
  });
});
