import type { Link, Portfolio } from './types';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

/** Returns a list of human-readable problems; empty means valid. */
export function validatePortfolio(portfolio: Portfolio): string[] {
  const errors: string[] = [];

  for (const key of ['name', 'role', 'bio'] as const) {
    if (!portfolio.owner[key].trim()) errors.push(`owner.${key} must not be empty`);
  }

  const seen = new Set<string>();
  for (const { id } of portfolio.sections) {
    if (seen.has(id)) errors.push(`Duplicate section id "${id}"`);
    seen.add(id);
  }

  const suns = portfolio.sections.filter((s) => s.body.kind === 'sun').length;
  if (suns !== 1) errors.push(`There must be exactly one sun section (found ${suns})`);

  let lastRadius = 0;
  for (const { id, body } of portfolio.sections) {
    if (body.size <= 0) errors.push(`Section "${id}": size must be positive`);
    if (body.kind !== 'planet') continue;

    const { orbit, colors } = body;
    if (orbit.radius <= lastRadius) {
      errors.push(
        `Section "${id}": orbit radius ${orbit.radius} must be larger than ${lastRadius}`,
      );
    }
    lastRadius = Math.max(lastRadius, orbit.radius);
    if (orbit.period <= 0) errors.push(`Section "${id}": orbit period must be positive`);
    if (orbit.eccentricity < 0 || orbit.eccentricity >= 1) {
      errors.push(`Section "${id}": eccentricity must be in [0, 1)`);
    }
    if (!colors.every((c) => HEX_COLOR.test(c))) {
      errors.push(`Section "${id}": colours must be 6-digit hex values like #aa5533`);
    }
  }

  const links: Link[] = [...portfolio.projects.flatMap((p) => p.links), ...portfolio.contact.links];
  for (const { label, url } of links) {
    if (!isHttps(url)) errors.push(`Link "${label}" must use https: ${url}`);
  }

  if (!EMAIL.test(portfolio.contact.email)) {
    errors.push(`contact.email is not a valid address: ${portfolio.contact.email}`);
  }

  return errors;
}
