export type SectionId = 'about' | 'skills' | 'projects' | 'experience' | 'contact';

export type PlanetSurface = 'rocky' | 'terran' | 'gas' | 'ringed';

export interface Orbit {
  /** Semi-major axis in scene units. */
  radius: number;
  /** Seconds for one full revolution. */
  period: number;
  /** 0 = circle, <1 = ellipse. */
  eccentricity: number;
  /** Tilt of the orbital plane, radians. */
  inclination: number;
  /** Starting angle, radians. */
  phase: number;
}

export type Body =
  | { kind: 'sun'; size: number }
  | {
      kind: 'planet';
      size: number;
      surface: PlanetSurface;
      colors: [string, string];
      orbit: Orbit;
    };

export interface Section {
  id: SectionId;
  title: string;
  tagline: string;
  body: Body;
}

export interface Link {
  label: string;
  url: string;
}

export interface Portfolio {
  owner: { name: string; role: string; bio: string; location: string };
  sections: Section[];
  skills: { group: string; items: string[] }[];
  projects: { title: string; description: string; tech: string[]; links: Link[] }[];
  experience: { role: string; org: string; start: string; end?: string; summary: string }[];
  contact: { email: string; links: Link[] };
}
