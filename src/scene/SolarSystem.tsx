import type { Section, SectionId } from '../data/types';

export interface SolarSystemProps {
  sections: Section[];
  onSelect: (id: SectionId) => void;
  /** Multiplier for orbital time. 0 freezes the system. */
  speed?: number;
}

export function SolarSystem(_props: SolarSystemProps) {
  return null;
}
