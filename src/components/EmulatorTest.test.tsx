import { render, screen } from '@testing-library/react';
import { EmulatorTest } from './EmulatorTest';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe.skip('EmulatorTest', () => {
  it('renders Firebase Emulator Test title', () => {
    render(<EmulatorTest />);
    expect(screen.getByText(/Firebase Emulator Test/i)).toBeInTheDocument();
  });
});
