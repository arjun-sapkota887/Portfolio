import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { portfolio } from '../data/portfolio';
import { navigationStore } from '../state/navigation';
import { NavMenu } from './NavMenu';

const initial = navigationStore.getState();
beforeEach(() => navigationStore.setState(initial, true));

describe('NavMenu', () => {
  it('lists every section as a button inside a labelled nav', () => {
    render(<NavMenu />);
    const nav = screen.getByRole('navigation', { name: /solar system/i });
    for (const section of portfolio.sections) {
      expect(nav).toContainElement(screen.getByRole('button', { name: section.title }));
    }
  });

  it('focuses a section when clicked', async () => {
    render(<NavMenu />);
    await userEvent.click(screen.getByRole('button', { name: 'Projects' }));
    expect(navigationStore.getState().active).toBe('projects');
  });

  it('is keyboard operable', async () => {
    render(<NavMenu />);
    screen.getByRole('button', { name: 'Skills' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(navigationStore.getState().active).toBe('skills');
  });

  it('marks the active section with aria-current', () => {
    render(<NavMenu />);
    act(() => navigationStore.getState().focus('contact'));
    expect(screen.getByRole('button', { name: 'Contact' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Skills' })).not.toHaveAttribute('aria-current');
  });

  it('exposes hover state to the scene', async () => {
    render(<NavMenu />);
    await userEvent.hover(screen.getByRole('button', { name: 'Experience' }));
    expect(navigationStore.getState().hovered).toBe('experience');
    await userEvent.unhover(screen.getByRole('button', { name: 'Experience' }));
    expect(navigationStore.getState().hovered).toBeNull();
  });
});
