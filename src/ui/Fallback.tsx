import type { ComponentType } from 'react';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';
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

/** Plain, scrollable version of the portfolio for browsers without WebGL. */
export function Fallback() {
  return (
    <div className="fallback">
      <header>
        <h1>{portfolio.owner.name}</h1>
        <p className="fallback-role">{portfolio.owner.role}</p>
        <p role="note" className="fallback-note">
          Your browser can’t show the interactive 3D solar system, so here is the same content as a
          simple page.
        </p>
        <nav aria-label="Sections">
          <ul>
            {portfolio.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {portfolio.sections.map((section) => {
        const Content = PANELS[section.id];
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="panel-body"
          >
            <p className="eyebrow">{section.tagline}</p>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <Content />
          </section>
        );
      })}
    </div>
  );
}
