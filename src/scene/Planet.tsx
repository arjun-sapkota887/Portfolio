import { useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import type { Section } from '../data/types';
import { orbitPosition } from '../lib/orbit';
import { createPlanetMaterial, createRingMaterial } from './shaders/materials';
import { useSceneTime } from './useSceneTime';

type PlanetSection = Section & { body: Extract<Section['body'], { kind: 'planet' }> };

interface PlanetProps {
  section: PlanetSection;
  seed: number;
  speed: number;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

const RING_INNER = 1.35;
const RING_OUTER = 2.3;

export function Planet({ section, seed, speed, onSelect, onHover }: PlanetProps) {
  const { id, body } = section;
  const group = useRef<Group>(null);
  const sphere = useRef<Mesh>(null);
  const material = useMemo(
    () => createPlanetMaterial(body.surface, body.colors, seed),
    [body.surface, body.colors, seed],
  );
  const ringMaterial = useMemo(
    () =>
      body.surface === 'ringed'
        ? createRingMaterial(body.colors, body.size * RING_INNER, body.size * RING_OUTER)
        : null,
    [body.surface, body.colors, body.size],
  );
  const start = useMemo(() => orbitPosition(body.orbit, 0), [body.orbit]);

  useSceneTime(speed, (time) => {
    group.current?.position.set(...orbitPosition(body.orbit, time));
    if (sphere.current) sphere.current.rotation.y = time * 0.3;
    material.uniforms.uTime.value = time;
  });

  return (
    <group name={`planet-${id}`} ref={group} position={start}>
      <mesh
        name={`planet-mesh-${id}`}
        ref={sphere}
        material={material}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
          onHover(false);
        }}
      >
        <sphereGeometry args={[body.size, 64, 64]} />
      </mesh>
      {ringMaterial && (
        <mesh name={`ring-${id}`} material={ringMaterial} rotation={[-Math.PI / 2 + 0.45, 0.15, 0]}>
          <ringGeometry args={[body.size * RING_INNER, body.size * RING_OUTER, 128]} />
        </mesh>
      )}
    </group>
  );
}
