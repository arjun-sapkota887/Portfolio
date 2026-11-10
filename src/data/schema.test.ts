import { validatePortfolio } from './schema';
import type { Portfolio, Section } from './types';

const planet = (id: Section['id'], radius: number): Section => ({
  id,
  title: id,
  tagline: `${id} tagline`,
  body: {
    kind: 'planet',
    size: 1,
    surface: 'rocky',
    colors: ['#aa5533', '#331100'],
    orbit: { radius, period: 30, eccentricity: 0.05, inclination: 0.1, phase: 0 },
  },
});

const valid = (): Portfolio => ({
  owner: { name: 'Ada', role: 'Engineer', bio: 'Bio', location: 'Earth' },
  sections: [
    { id: 'about', title: 'About', tagline: 't', body: { kind: 'sun', size: 3 } },
    planet('skills', 8),
    planet('projects', 13),
  ],
  skills: [{ group: 'Frontend', items: ['React'] }],
  projects: [
    { title: 'P', description: 'D', tech: ['TS'], links: [{ label: 'Code', url: 'https://x.dev' }] },
  ],
  experience: [{ role: 'Dev', org: 'Org', start: '2024', summary: 'S' }],
  contact: { email: 'ada@example.com', links: [{ label: 'GitHub', url: 'https://github.com/ada' }] },
});

describe('validatePortfolio', () => {
  it('accepts a valid portfolio', () => {
    expect(validatePortfolio(valid())).toEqual([]);
  });

  it('requires a non-empty owner name', () => {
    const p = valid();
    p.owner.name = '  ';
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/owner\.name/));
  });

  it('rejects duplicate section ids', () => {
    const p = valid();
    p.sections.push(planet('skills', 20));
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/duplicate section id "skills"/i));
  });

  it('requires exactly one sun', () => {
    const none = valid();
    none.sections = none.sections.filter((s) => s.body.kind !== 'sun');
    expect(validatePortfolio(none)).toContainEqual(expect.stringMatching(/exactly one sun/i));

    const two = valid();
    two.sections.push({ id: 'contact', title: 'C', tagline: 't', body: { kind: 'sun', size: 2 } });
    expect(validatePortfolio(two)).toContainEqual(expect.stringMatching(/exactly one sun/i));
  });

  it('requires planet orbit radii to strictly increase', () => {
    const p = valid();
    p.sections.push(planet('contact', 13));
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/contact.*orbit radius/i));
  });

  it('rejects eccentricity outside [0, 1)', () => {
    const p = valid();
    const body = p.sections[1].body;
    if (body.kind === 'planet') body.orbit.eccentricity = 1;
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/skills.*eccentricity/i));
  });

  it('rejects non-positive periods and sizes', () => {
    const p = valid();
    const body = p.sections[1].body;
    if (body.kind === 'planet') {
      body.orbit.period = 0;
      body.size = -1;
    }
    const errors = validatePortfolio(p);
    expect(errors).toContainEqual(expect.stringMatching(/skills.*period/i));
    expect(errors).toContainEqual(expect.stringMatching(/skills.*size/i));
  });

  it('rejects invalid hex colours', () => {
    const p = valid();
    const body = p.sections[1].body;
    if (body.kind === 'planet') body.colors = ['red', '#12345'];
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/skills.*colou?r/i));
  });

  it('only allows https links', () => {
    const p = valid();
    p.projects[0].links[0].url = 'http://insecure.dev';
    p.contact.links[0].url = 'javascript:alert(1)';
    const errors = validatePortfolio(p);
    expect(errors).toContainEqual(expect.stringMatching(/http:\/\/insecure\.dev/));
    expect(errors).toContainEqual(expect.stringMatching(/javascript:alert/));
  });

  it('requires a plausible contact email', () => {
    const p = valid();
    p.contact.email = 'not-an-email';
    expect(validatePortfolio(p)).toContainEqual(expect.stringMatching(/contact\.email/));
  });
});
