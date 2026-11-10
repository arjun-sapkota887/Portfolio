import { act, render, screen } from '@testing-library/react';
import { portfolio } from '../data/portfolio';
import { navigationStore } from '../state/navigation';
import { HoverLabel } from './HoverLabel';

const initial = navigationStore.getState();
beforeEach(() => navigationStore.setState(initial, true));

describe('HoverLabel', () => {
  it('is empty when nothing is hovered', () => {
    render(<HoverLabel />);
    expect(screen.queryByRole('status')).toBeEmptyDOMElement();
  });

  it('shows the hovered section title and tagline', () => {
    render(<HoverLabel />);
    const projects = portfolio.sections.find((s) => s.id === 'projects')!;
    act(() => navigationStore.getState().hover('projects'));
    expect(screen.getByRole('status')).toHaveTextContent(projects.title);
    expect(screen.getByRole('status')).toHaveTextContent(projects.tagline);
  });

  it('hides while a section is focused', () => {
    render(<HoverLabel />);
    act(() => {
      navigationStore.getState().focus('skills');
      navigationStore.getState().hover('projects');
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
