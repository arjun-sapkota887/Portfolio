import { useEffect, useId, useRef, type ComponentType } from 'react';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';
import { navigationStore, useNavigation } from '../state/navigation';
import { AboutPanel } from './panels/AboutPanel';
import { ContactPanel } from './panels/ContactPanel';
import { ExperiencePanel } from './panels/ExperiencePanel';
import { ProjectsPanel } from './panels/ProjectsPanel';
import { SkillsPanel } from './panels/SkillsPanel';

const PANELS: Record<SectionId, ComponentType> = {
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  contact: ContactPanel,
};

const sections = new Map(portfolio.sections.map((s) => [s.id, s]));

/** Glass panel with the focused section's content. */
export function SectionPanel() {
  const active = useNavigation((s) => s.active);
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, [active]);

  if (!active) return null;
  const section = sections.get(active)!;
  const Content = PANELS[active];

  return (
    <section className="panel" aria-labelledby={headingId} key={active}>
      <header>
        <p className="eyebrow">{section.tagline}</p>
        <h2 id={headingId} ref={heading} tabIndex={-1}>
          {section.title}
        </h2>
        <button type="button" className="close" onClick={() => navigationStore.getState().back()}>
          <span aria-hidden="true">←</span> Back to overview
        </button>
      </header>
      <div className="panel-body" tabIndex={0}>
        <Content />
      </div>
    </section>
  );
}
