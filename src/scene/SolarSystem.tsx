import type { Section, SectionId } from '../data/types';
import { MilkyWay } from './MilkyWay';
import { OrbitRing } from './OrbitRing';
import { Planet } from './Planet';
import { Starfield } from './Starfield';
import { Sun } from './Sun';

export interface SolarSystemProps {
  sections: Section[];
  onSelect: (id: SectionId) => void;
  /** Multiplier for orbital time. 0 freezes the system. */
  speed?: number;
}

export function SolarSystem({ sections, onSelect, speed = 1 }: SolarSystemProps) {
  return (
    <group>
      <MilkyWay />
      <Starfield speed={speed} />
      {sections.map((section, index) => {
        const { body } = section;
        if (body.kind === 'sun') {
          return (
            <Sun
              key={section.id}
              size={body.size}
              speed={speed}
              onSelect={() => onSelect(section.id)}
            />
          );
        }
        return (
          <group key={section.id}>
            <OrbitRing id={section.id} orbit={body.orbit} />
            <Planet
              section={{ ...section, body }}
              seed={index * 7.31}
              speed={speed}
              onSelect={() => onSelect(section.id)}
            />
          </group>
        );
      })}
    </group>
  );
}
