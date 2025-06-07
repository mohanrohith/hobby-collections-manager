import { render, screen } from '@testing-library/react';
import { Home } from './Home';

describe.skip('Home', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Hobby Collections Manager/i)).toBeInTheDocument();
  });
});
