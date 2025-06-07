import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/items' }),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe.skip('Navigation', () => {
  it('renders navigation links', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText(/Items/i)).toBeInTheDocument();
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/More/i)).toBeInTheDocument();
  });

  it('highlights the active link', () => {
    renderWithRouter(<Navigation />);
    const activeLink = screen.getByText(/Items/i);
    expect(activeLink).toHaveClass('text-blue-400');
  });

  it('shows dropdown menu when More button is clicked', () => {
    renderWithRouter(<Navigation />);
    const moreButton = screen.getByText(/More/i);
    moreButton.click();

    expect(screen.getByText(/Emulator Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Auth Test/i)).toBeInTheDocument();
  });
});
