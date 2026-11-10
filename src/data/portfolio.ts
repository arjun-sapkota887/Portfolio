// All site content lives here. Replace the placeholder text with your own;
// `npm test` validates it (see schema.ts), so typos in links or orbits are caught.
import type { Portfolio } from './types';

const deg = (d: number) => (d * Math.PI) / 180;

export const portfolio: Portfolio = {
  owner: {
    name: 'Arjun Sapkota',
    role: 'Computer Science Student · UPEI',
    bio: 'Fourth-year Computer Science student with hands-on experience in machine learning, Flutter/Firebase application development, browser extensions, and collaborative software projects. Strong academic foundation in operating systems, databases, networking, and software architecture, with a growing interest in AI systems, agentic software, and privacy-first local computing.',
    location: 'Charlottetown, PE, Canada',
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
      tagline: 'Small, dense and hot — the languages and tools I build with',
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
      tagline: 'Living worlds I have helped build',
      body: {
        kind: 'planet',
        size: 0.85,
        surface: 'terran',
        colors: ['#2f6fb5', '#3f8f4a'],
        orbit: {
          radius: 11,
          period: 60,
          eccentricity: 0.04,
          inclination: deg(-2),
          phase: deg(140),
        },
      },
    },
    {
      id: 'experience',
      title: 'Experience',
      tagline: 'The giant — work and leadership, banded together',
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
        orbit: {
          radius: 24,
          period: 140,
          eccentricity: 0.07,
          inclination: deg(-3),
          phase: deg(320),
        },
      },
    },
  ],

  skills: [
    {
      group: 'Languages',
      items: ['Python', 'C', 'Java', 'Dart', 'SQL', 'JavaScript', 'PHP', 'HTML/CSS'],
    },
    {
      group: 'Frameworks & Tools',
      items: ['Flutter', 'Firebase', 'Git/GitHub', 'MLflow', 'Linux', 'scikit-learn'],
    },
    { group: 'Databases', items: ['MySQL', 'Firebase/Cloud Firestore', 'MongoDB'] },
    {
      group: 'Foundations',
      items: [
        'OOP & design patterns',
        'Software architecture',
        'ML workflows',
        'Neural networks',
        'OS concepts',
        'TCP/IP & web protocols',
      ],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Science, Computer Science',
      school: 'University of Prince Edward Island (UPEI)',
      minor: 'Business',
      expected: 'Expected Apr 2027',
      coursework: [
        'Machine Learning & Data Mining',
        'Operating Systems',
        'Database Systems',
        'Software Design & Architecture',
        'Computer Communications',
        'Data Structures & Algorithms',
        'Computer Organization & Architecture',
        'Mobile Device Development',
      ],
    },
  ],

  projects: [
    {
      title: 'MedRemind',
      description:
        'A team-built medication reminder and coordination app with authentication, personal and shared medication workflows, daily schedules, dose tracking, notifications, activity logs and accessibility features. I led UI/UX research and design, navigation, the home and medication screens, the dosage swipe interaction and the app icon, and contributed to authentication, authorization and Firebase setup — in a feature-first Clean Architecture codebase using BLoC/Cubit and a branch/PR/code-review Git workflow.',
      tech: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'Git'],
      links: [],
    },
    {
      title: 'EcoShopper',
      description:
        'A team-built Chrome extension that analyses Amazon product pages and surfaces sustainability information right beside the shopping experience: product-data extraction, keyword-based category and material detection, local heuristic scoring and UI injection produce a 0–100 sustainability score with curated greener alternatives.',
      tech: ['Chrome Manifest V3', 'JavaScript', 'DOM', 'JSON'],
      links: [],
      award: 'Innovation & Impact Award',
    },
    {
      title: 'Bike Sharing Demand',
      description:
        'Reproducible classification and regression workflows on 10,000+ hourly records, comparing classical ML baselines with a neural network. Preprocessing, feature engineering, train/validation/test splits, hyperparameter tuning, and evaluation with Accuracy/F1, MAE/RMSE, confusion matrices and residual analysis, all tracked in MLflow.',
      tech: ['Python', 'MLflow', 'Machine Learning', 'Neural Networks'],
      links: [],
    },
  ],

  experience: [
    {
      role: 'Student Assistant — Exam Proctor & Scribe',
      org: 'UPEI',
      start: 'Sep 2024',
      summary:
        'Administer exams, maintain digital records and academic-integrity procedures, provide accessibility-focused scribing and technical support, and manage time-sensitive logistics.',
    },
    {
      role: 'Participant',
      org: 'Science Atlantic Programming Contest, Nova Scotia',
      start: 'Oct 2024',
      end: 'Oct 2024',
      summary: 'Team-based algorithmic problem solving under time constraints.',
    },
  ],

  contact: {
    email: 'asapkota@upei.ca',
    links: [{ label: 'GitHub', url: 'https://github.com/arjun-sapkota887' }],
  },
};
