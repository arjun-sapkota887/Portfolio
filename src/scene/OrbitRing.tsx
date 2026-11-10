import { useMemo } from 'react';
import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import type { Orbit } from '../data/types';
import { orbitPath } from '../lib/orbit';

export function OrbitRing({ id, orbit }: { id: string; orbit: Orbit }) {
  const line = useMemo(() => {
    const points = orbitPath(orbit, 256).map(([x, y, z]) => new Vector3(x, y, z));
    const material = new LineBasicMaterial({ color: '#f3dfb4', transparent: true, opacity: 0.28 });
    return new Line(new BufferGeometry().setFromPoints(points), material);
  }, [orbit]);

  return <primitive name={`orbit-${id}`} object={line} />;
}
