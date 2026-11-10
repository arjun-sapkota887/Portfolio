import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { portfolio } from '../data/portfolio';
import { navigationStore } from '../state/navigation';
import { Intro } from './Intro';

const initial = navigationStore.getState();
beforeEach(() => navigationStore.setState(initial, true));
afterEach(() => vi.useRealTimers());

describe('Intro', () => {
  it('greets the visitor before they enter', () => {
    render(<Intro instant={false} />);
    expect(screen.getByRole('dialog', { name: /welcome/i })).toHaveTextContent(
      portfolio.owner.name,
    );
    expect(screen.getByRole('button', { name: /enter/i })).toHaveFocus();
  });

  it('Enter starts the dive, then finishes the intro', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Intro instant={false} diveMs={1500} />);
    await userEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(navigationStore.getState().diving).toBe(true);
    expect(navigationStore.getState().introDone).toBe(false);
    act(() => vi.advanceTimersByTime(1500));
    expect(navigationStore.getState()).toMatchObject({ introDone: true, diving: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Skip finishes immediately', async () => {
    render(<Intro instant={false} />);
    await userEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(navigationStore.getState().introDone).toBe(true);
  });

  it('Enter is instant when motion is reduced', async () => {
    render(<Intro instant />);
    await userEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(navigationStore.getState().introDone).toBe(true);
  });

  it('renders nothing once the intro is done', () => {
    navigationStore.getState().finishIntro();
    render(<Intro instant={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
