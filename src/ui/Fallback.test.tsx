import { render, screen, within } from '@testing-library/react';
import { portfolio } from '../data/portfolio';
import { Fallback } from './Fallback';

describe('Fallback', () => {
  it('explains that 3D is unavailable', () => {
    render(<Fallback />);
    expect(screen.getByRole('note')).toHaveTextContent(/3d/i);
  });

  it('renders every section as a readable page', () => {
    render(<Fallback />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(portfolio.owner.name);
    for (const section of portfolio.sections) {
      const region = screen.getByRole('region', { name: section.title });
      expect(within(region).getByRole('heading', { level: 2 })).toHaveTextContent(section.title);
    }
    expect(screen.getByText(portfolio.owner.bio)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: portfolio.contact.email })).toBeInTheDocument();
  });

  it('links sections from a table of contents', () => {
    render(<Fallback />);
    const toc = screen.getByRole('navigation', { name: /sections/i });
    for (const section of portfolio.sections) {
      expect(within(toc).getByRole('link', { name: section.title })).toHaveAttribute(
        'href',
        `#${section.id}`,
      );
    }
  });
});
