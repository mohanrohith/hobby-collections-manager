import { render, screen, fireEvent } from '@testing-library/react';
import { ItemManager } from './ItemManager';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
jest.mock('../hooks/useItems');
jest.mock('../hooks/useCategories');

const mockItems = [
  {
    id: '1',
    name: 'Test Item 1',
    category: 'Books',
    dateAdded: '2024-01-01',
    dateModified: '2024-01-01',
  },
  {
    id: '2',
    name: 'Test Item 2',
    category: 'LEGO',
    dateAdded: '2024-01-02',
    dateModified: '2024-01-02',
  },
];

const mockCategories = [
  { id: '1', name: 'Books' },
  { id: '2', name: 'LEGO' },
];

describe.skip('ItemManager', () => {
  beforeEach(() => {
    (useItems as jest.Mock).mockReturnValue({
      data: mockItems,
      isLoading: false,
      error: null,
    });

    (useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders the item manager title', () => {
    renderWithRouter(<ItemManager />);
    expect(screen.getByText('Item Manager')).toBeInTheDocument();
  });

  it('displays items in a list', () => {
    renderWithRouter(<ItemManager />);
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useItems as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithRouter(<ItemManager />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Failed to load items');
    (useItems as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
    });

    renderWithRouter(<ItemManager />);
    expect(screen.getByText('Error: Failed to load items')).toBeInTheDocument();
  });

  it('displays empty state when no items exist', () => {
    (useItems as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithRouter(<ItemManager />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders the add item button', () => {
    renderWithRouter(<ItemManager />);
    const addButton = screen.getByRole('button', { name: /add item/i });
    expect(addButton).toBeInTheDocument();
  });

  it('navigates to add item page when add button is clicked', () => {
    renderWithRouter(<ItemManager />);
    const addButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe('/items/add');
  });
});
