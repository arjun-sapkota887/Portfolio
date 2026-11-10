import { portfolio } from '../../data/portfolio';

export function SkillsPanel() {
  return (
    <div className="skill-groups">
      {portfolio.skills.map(({ group, items }) => (
        <section key={group} aria-label={group}>
          <h3>{group}</h3>
          <ul className="tags">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
