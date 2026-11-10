import type { Link } from '../../data/types';

export function ExternalLink({ label, url }: Link) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}
