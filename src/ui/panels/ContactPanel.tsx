import { portfolio } from '../../data/portfolio';
import { ExternalLink } from './ExternalLink';

export function ContactPanel() {
  const { email, links } = portfolio.contact;
  return (
    <>
      <p className="lede">The best way to reach me is email:</p>
      <p className="email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p className="links">
        {links.map((link) => (
          <ExternalLink key={link.url} {...link} />
        ))}
      </p>
    </>
  );
}
