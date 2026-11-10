import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import App from './App';
import { portfolio } from './data/portfolio';
import { navigationStore } from './state/navigation';

const initial = navigationStore.getState();
beforeEach(() => {
  navigationStore.setState(initial, true);
  history.replaceState(null, '', '/');
});

vi.mock('./scene/SceneRoot', () => ({
  default: () => <div data-testid="scene" />,
}));

describe('App', () => {
  it('shows the intro first', () => {
    render(<App />);
    expect(screen.getByRole('dialog', { name: /welcome/i })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders the owner name as the main heading', () => {
    navigationStore.getState().finishIntro();
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(portfolio.owner.name);
  });

  it('shows the owner role', () => {
    navigationStore.getState().finishIntro();
    render(<App />);
    expect(screen.getByText(portfolio.owner.role)).toBeInTheDocument();
  });

  it('lazy-loads the 3D scene', async () => {
    render(<App />);
    expect(await screen.findByTestId('scene')).toBeInTheDocument();
  });

  it('opens the section named in the URL hash', () => {
    history.replaceState(null, '', '/#skills');
    render(<App />);
    expect(screen.getByRole('region', { name: 'Skills' })).toBeInTheDocument();
  });

  it('closes the panel with Escape', async () => {
    history.replaceState(null, '', '/#skills');
    render(<App />);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('region', { name: 'Skills' })).not.toBeInTheDocument();
  });

  it('includes the section navigation', () => {
    navigationStore.getState().finishIntro();
    render(<App />);
    expect(screen.getByRole('navigation', { name: /solar system/i })).toBeInTheDocument();
  });
});
