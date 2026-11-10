import { render, screen } from '@testing-library/react';
import App from './App';
import { portfolio } from './data/portfolio';

describe('App', () => {
  it('renders the owner name as the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(portfolio.owner.name);
  });
});
