import { useMemo } from 'react';
import { createMilkyWayMaterial } from './shaders/materials';

export function MilkyWay() {
  const material = useMemo(() => createMilkyWayMaterial(), []);
  return (
    <mesh name="milky-way" material={material} renderOrder={-1}>
      <sphereGeometry args={[400, 64, 32]} />
    </mesh>
  );
}
