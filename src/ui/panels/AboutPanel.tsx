import { portfolio } from '../../data/portfolio';

export function AboutPanel() {
  const { owner } = portfolio;
  return (
    <>
      <p className="lede">{owner.bio}</p>
      <dl className="facts">
        <dt>Role</dt>
        <dd>{owner.role}</dd>
        <dt>Based in</dt>
        <dd>{owner.location}</dd>
      </dl>
    </>
  );
}
