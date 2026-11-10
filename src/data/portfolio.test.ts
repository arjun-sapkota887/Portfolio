import { portfolio } from './portfolio';
import { validatePortfolio } from './schema';

describe('portfolio content', () => {
  it('passes schema validation', () => {
    expect(validatePortfolio(portfolio)).toEqual([]);
  });

  it('has the Sun as About plus one planet per remaining section', () => {
    const byId = Object.fromEntries(portfolio.sections.map((s) => [s.id, s.body.kind]));
    expect(byId).toEqual({
      about: 'sun',
      skills: 'planet',
      projects: 'planet',
      experience: 'planet',
      contact: 'planet',
    });
  });

  it('gives Contact the ringed planet', () => {
    const contact = portfolio.sections.find((s) => s.id === 'contact')!;
    expect(contact.body).toMatchObject({ kind: 'planet', surface: 'ringed' });
  });

  it('uses the owner details from the resume', () => {
    expect(portfolio.owner.name).toBe('Arjun Sapkota');
    expect(portfolio.contact.email).toBe('asapkota@upei.ca');
    expect(portfolio.contact.links).toContainEqual({
      label: 'GitHub',
      url: 'https://github.com/arjun-sapkota887',
    });
  });

  it('does not publish a phone number', () => {
    const text = [portfolio.owner, portfolio.contact].flatMap((o) => Object.values(o)).join(' ');
    expect(text).not.toMatch(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  });
});
