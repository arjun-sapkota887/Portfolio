import { portfolio } from '../../data/portfolio';

export function ExperiencePanel() {
  return (
    <ol className="timeline">
      {portfolio.experience.map((job) => (
        <li key={`${job.org}-${job.start}`}>
          <h3>
            {job.role} <span className="org">· {job.org}</span>
          </h3>
          <p className="dates">
            {job.start} – {job.end ?? 'Present'}
          </p>
          <p>{job.summary}</p>
        </li>
      ))}
    </ol>
  );
}
