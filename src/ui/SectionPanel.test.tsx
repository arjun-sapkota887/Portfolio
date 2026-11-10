import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';
import { navigationStore } from '../state/navigation';
import { SectionPanel } from './SectionPanel';

const initial = navigationStore.getState();
beforeEach(() => navigationStore.setState(initial, true));

const open = (id: SectionId) => {
  render(<SectionPanel />);
  act(() => navigationStore.getState().focus(id));
  return screen.getByRole('region', { name: portfolio.sections.find((s) => s.id === id)!.title });
};

describe('SectionPanel', () => {
  it('renders nothing on the overview', () => {
    render(<SectionPanel />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('moves keyboard focus to the panel heading when opened', () => {
    const panel = open('skills');
    expect(within(panel).getByRole('heading', { level: 2 })).toHaveFocus();
  });

  it('makes the scrollable body keyboard-focusable', () => {
    const panel = open('projects');
    expect(panel.querySelector('.panel-body')).toHaveAttribute('tabindex', '0');
  });

  it('closes back to the overview', async () => {
    open('skills');
    await userEvent.click(screen.getByRole('button', { name: /back to overview/i }));
    expect(navigationStore.getState().active).toBeNull();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('About shows the bio and location', () => {
    const panel = open('about');
    expect(panel).toHaveTextContent(portfolio.owner.bio);
    expect(panel).toHaveTextContent(portfolio.owner.location);
  });

  it('About shows education with expected date and coursework', () => {
    const panel = open('about');
    expect(portfolio.education.length).toBeGreaterThan(0);
    for (const edu of portfolio.education) {
      expect(panel).toHaveTextContent(edu.degree);
      expect(panel).toHaveTextContent(edu.school);
      expect(panel).toHaveTextContent(edu.expected);
      for (const course of edu.coursework)
        expect(within(panel).getByText(course)).toBeInTheDocument();
    }
  });

  it('Skills lists every group and item', () => {
    const panel = open('skills');
    for (const { group, items } of portfolio.skills) {
      expect(within(panel).getByRole('heading', { name: group })).toBeInTheDocument();
      for (const item of items) expect(within(panel).getByText(item)).toBeInTheDocument();
    }
  });

  it('Projects shows each project with safe external links', () => {
    const panel = open('projects');
    for (const project of portfolio.projects) {
      const card = within(panel).getByRole('article', { name: project.title });
      expect(card).toHaveTextContent(project.description);
      for (const link of project.links) {
        const a = within(card).getByRole('link', { name: new RegExp(link.label) });
        expect(a).toHaveAttribute('href', link.url);
        expect(a).toHaveAttribute('target', '_blank');
        expect(a).toHaveAttribute('rel', expect.stringContaining('noopener'));
      }
    }
  });

  it('Projects shows award badges', () => {
    const panel = open('projects');
    const awarded = portfolio.projects.filter((p) => p.award);
    expect(awarded.length).toBeGreaterThan(0);
    for (const project of awarded) {
      const card = within(panel).getByRole('article', { name: project.title });
      expect(within(card).getByText(project.award!)).toBeInTheDocument();
    }
  });

  it('Projects without links render no empty link row', () => {
    const panel = open('projects');
    const linkless = portfolio.projects.filter((p) => p.links.length === 0);
    expect(linkless.length).toBeGreaterThan(0);
    for (const project of linkless) {
      const card = within(panel).getByRole('article', { name: project.title });
      expect(card.querySelector('.links')).toBeNull();
    }
  });

  it('Experience shows role, organisation and dates', () => {
    const panel = open('experience');
    for (const job of portfolio.experience) {
      expect(panel).toHaveTextContent(job.role);
      expect(panel).toHaveTextContent(job.org);
      const dates = !job.end
        ? `${job.start} – Present`
        : job.end === job.start
          ? job.start
          : `${job.start} – ${job.end}`;
      expect(panel).toHaveTextContent(dates);
    }
  });

  it('Experience shows a single date for one-off events', () => {
    const panel = open('experience');
    const oneOff = portfolio.experience.find((j) => j.end && j.end === j.start);
    expect(oneOff).toBeDefined();
    expect(panel).not.toHaveTextContent(`${oneOff!.start} – ${oneOff!.start}`);
  });

  it('Contact shows the email as text and a mailto link, plus profile links', () => {
    const panel = open('contact');
    expect(panel).toHaveTextContent(portfolio.contact.email);
    expect(within(panel).getByRole('link', { name: portfolio.contact.email })).toHaveAttribute(
      'href',
      `mailto:${portfolio.contact.email}`,
    );
    for (const link of portfolio.contact.links) {
      expect(within(panel).getByRole('link', { name: new RegExp(link.label) })).toHaveAttribute(
        'href',
        link.url,
      );
    }
  });
});
