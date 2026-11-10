import { render, screen } from '@testing-library/react';
import App from './App';
import { portfolio } from './data/portfolio';

vi.mock('./scene/SceneRoot', () => ({
  default: () => <div data-testid="scene" />,
}));

describe('App', () => {
  it('renders the owner name as the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(portfolio.owner.name);
  });

  it('shows the owner role', () => {
    render(<App />);
    expect(screen.getByText(portfolio.owner.role)).toBeInTheDocument();
  });

  it('lazy-loads the 3D scene', async () => {
    render(<App />);
    expect(await screen.findByTestId('scene')).toBeInTheDocument();
  });
});
