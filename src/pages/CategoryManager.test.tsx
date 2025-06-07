import { render, screen } from '@testing-library/react';
import { CategoryManager } from './CategoryManager';
import { useCategories } from '../hooks/useCategories';

// Mock the useCategories hook
jest.mock('../hooks/useCategories', () => ({
  useCategories: jest.fn(),
}));

describe.skip('CategoryManager', () => {
  beforeEach(() => {
    (useCategories as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  it('renders the category manager title', () => {
    render(<CategoryManager />);
    expect(screen.getByText('Category Manager')).toBeInTheDocument();
  });

  it('renders the categories section', () => {
    render(<CategoryManager />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('No categories found.')).toBeInTheDocument();
  });

  it('renders the add category form', () => {
    render(<CategoryManager />);
    const form = screen.getByTestId('add-category-form');
    expect(form).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Category Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Icon URL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Default Tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();
  });
});
