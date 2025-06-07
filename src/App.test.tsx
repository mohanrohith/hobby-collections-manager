import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock useAuth and AuthProvider
jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// No need for BrowserRouter here, App already includes it

describe.skip('App', () => {
  test('renders navigation links', () => {
    render(<App />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const emulatorTestLink = screen.getByRole('link', { name: /emulator test/i });
    expect(homeLink).toBeInTheDocument();
    expect(emulatorTestLink).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    render(<App />);
    const homePage = screen.getByText((content) =>
      /welcome to hobby collections manager/i.test(content)
    );
    expect(homePage).toBeInTheDocument();
  });
});
