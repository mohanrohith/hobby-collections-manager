import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Wrap the App component with BrowserRouter for testing
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

test('renders navigation links', () => {
  renderWithRouter(<App />);
  const homeLink = screen.getByText(/home/i);
  const emulatorTestLink = screen.getByText(/emulator test/i);
  expect(homeLink).toBeInTheDocument();
  expect(emulatorTestLink).toBeInTheDocument();
});

test('renders home page by default', () => {
  renderWithRouter(<App />);
  const homePage = screen.getByText(/home page/i);
  expect(homePage).toBeInTheDocument();
});
