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
});
