import { portfolio } from '../../data/portfolio';

export function AboutPanel() {
  const { owner, education } = portfolio;
  return (
    <>
      <p className="lede">{owner.bio}</p>
      <dl className="facts">
        <dt>Role</dt>
        <dd>{owner.role}</dd>
        <dt>Based in</dt>
        <dd>{owner.location}</dd>
      </dl>
      {education.map((edu) => (
        <section key={edu.school} className="education" aria-label="Education">
          <h3>{edu.degree}</h3>
          <p>
            {edu.school}
            {edu.minor && <> · Minor in {edu.minor}</>}
          </p>
          <p className="dates">{edu.expected}</p>
          <ul className="tags" aria-label="Relevant coursework">
            {edu.coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
