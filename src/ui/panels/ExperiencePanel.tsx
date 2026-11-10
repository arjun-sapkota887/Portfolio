import { portfolio } from '../../data/portfolio';

const formatDates = (start: string, end?: string) =>
  !end ? `${start} – Present` : end === start ? start : `${start} – ${end}`;

export function ExperiencePanel() {
  return (
    <ol className="timeline">
      {portfolio.experience.map((job) => (
        <li key={`${job.org}-${job.start}`}>
          <h3>
            {job.role} <span className="org">· {job.org}</span>
          </h3>
          <p className="dates">{formatDates(job.start, job.end)}</p>
          <p>{job.summary}</p>
        </li>
      ))}
    </ol>
  );
}
