import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// No need for BrowserRouter here, App already includes it

test('renders navigation links', () => {
  render(<App />);
  const homeLink = screen.getByRole('link', { name: /home/i });
  const emulatorTestLink = screen.getByRole('link', { name: /emulator test/i });
  expect(homeLink).toBeInTheDocument();
  expect(emulatorTestLink).toBeInTheDocument();
});

test('renders home page by default', () => {
  render(<App />);
  const homePage = screen.getByText(/home page/i);
  expect(homePage).toBeInTheDocument();
});
