import { render, screen } from '@testing-library/react';
import App from './App';

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

describe('App', () => {
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
