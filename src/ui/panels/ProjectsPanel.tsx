import { useId } from 'react';
import { portfolio } from '../../data/portfolio';
import { ExternalLink } from './ExternalLink';

function ProjectCard({ project }: { project: (typeof portfolio.projects)[number] }) {
  const titleId = useId();
  return (
    <article className="card" aria-labelledby={titleId}>
      <h3 id={titleId}>{project.title}</h3>
      {project.award && (
        <p className="award">
          <span aria-hidden="true">★ </span>
          <span>{project.award}</span>
        </p>
      )}
      <p>{project.description}</p>
      <ul className="tags" aria-label="Technologies">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {project.links.length > 0 && (
        <p className="links">
          {project.links.map((link) => (
            <ExternalLink key={link.url} {...link} />
          ))}
        </p>
      )}
    </article>
  );
}

export function ProjectsPanel() {
  return (
    <div className="cards">
      {portfolio.projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}
