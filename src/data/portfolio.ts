// All site content lives here. Replace the placeholder text with your own;
// `npm test` validates it (see schema.ts), so typos in links or orbits are caught.
import type { Portfolio } from './types';

const deg = (d: number) => (d * Math.PI) / 180;

export const portfolio: Portfolio = {
  owner: {
    name: 'Your Name',
    role: 'Software Developer',
    bio: 'I build thoughtful, performant software and love turning complex ideas into interfaces people enjoy using. Replace this with a short story about you.',
    location: 'Your City, Country',
  },

  sections: [
    {
      id: 'about',
      title: 'About',
      tagline: 'The star at the centre of it all',
      body: { kind: 'sun', size: 3.2 },
    },
    {
      id: 'skills',
      title: 'Skills',
      tagline: 'Small, dense and hot — the tools I reach for daily',
      body: {
        kind: 'planet',
        size: 0.55,
        surface: 'rocky',
        colors: ['#c8743a', '#5a2e17'],
        orbit: { radius: 7, period: 38, eccentricity: 0.06, inclination: deg(3), phase: deg(20) },
      },
    },
    {
      id: 'projects',
      title: 'Projects',
      tagline: 'A living world of things I have built',
      body: {
        kind: 'planet',
        size: 0.85,
        surface: 'terran',
        colors: ['#2f6fb5', '#3f8f4a'],
        orbit: { radius: 11, period: 60, eccentricity: 0.04, inclination: deg(-2), phase: deg(140) },
      },
    },
    {
      id: 'experience',
      title: 'Experience',
      tagline: 'The giant — years of work, banded together',
      body: {
        kind: 'planet',
        size: 1.6,
        surface: 'gas',
        colors: ['#d9b48c', '#8a5a3c'],
        orbit: { radius: 17, period: 95, eccentricity: 0.05, inclination: deg(4), phase: deg(250) },
      },
    },
    {
      id: 'contact',
      title: 'Contact',
      tagline: 'Ringed and reachable — say hello',
      body: {
        kind: 'planet',
        size: 1.3,
        surface: 'ringed',
        colors: ['#e3cf9f', '#a88a5c'],
        orbit: { radius: 24, period: 140, eccentricity: 0.07, inclination: deg(-3), phase: deg(320) },
      },
    },
  ],

  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
    { group: 'Frontend', items: ['React', 'Three.js', 'CSS', 'Accessibility'] },
    { group: 'Backend', items: ['Node.js', 'REST APIs', 'PostgreSQL'] },
    { group: 'Practices', items: ['Test-driven development', 'Git', 'CI/CD'] },
  ],

  projects: [
    {
      title: 'Solar Portfolio',
      description: 'This site: an explorable 3D solar system built with React Three Fiber and procedural shaders.',
      tech: ['React', 'Three.js', 'TypeScript', 'Vitest'],
      links: [{ label: 'Source', url: 'https://github.com/your-username/solar-portfolio' }],
    },
    {
      title: 'Project Two',
      description: 'Describe a project you are proud of: the problem, your role, and the outcome.',
      tech: ['Node.js', 'PostgreSQL'],
      links: [{ label: 'Live', url: 'https://example.com' }],
    },
    {
      title: 'Project Three',
      description: 'Another highlight. Keep it to two sentences and link to a demo or the code.',
      tech: ['Python', 'FastAPI'],
      links: [{ label: 'Source', url: 'https://github.com/your-username/project-three' }],
    },
  ],

  experience: [
    {
      role: 'Software Developer',
      org: 'Company Name',
      start: '2024',
      summary: 'What you worked on and the impact it had.',
    },
    {
      role: 'Developer Intern',
      org: 'Another Company',
      start: '2023',
      end: '2024',
      summary: 'A short summary of your internship.',
    },
  ],

  contact: {
    email: 'you@example.com',
    links: [
      { label: 'GitHub', url: 'https://github.com/your-username' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-username' },
    ],
  },
};
