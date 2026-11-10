import { useMemo } from 'react';
import { BufferAttribute, BufferGeometry } from 'three';
import { mulberry32 } from '../lib/random';
import { createStarMaterial } from './shaders/materials';
import { useSceneTime } from './useSceneTime';

const PALETTE: [number, number, number][] = [
  [1, 1, 1],
  [0.75, 0.85, 1],
  [1, 0.88, 0.7],
  [1, 0.75, 0.6],
];

export function Starfield({
  count = 4000,
  seed = 1,
  speed,
}: {
  count?: number;
  seed?: number;
  speed: number;
}) {
  const geometry = useMemo(() => {
    const rand = mulberry32(seed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkle = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 120 + rand() * 220;
      positions.set(
        [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ],
        i * 3,
      );
      colors.set(PALETTE[Math.floor(rand() * PALETTE.length)], i * 3);
      sizes[i] = 0.6 + rand() ** 4 * 3;
      twinkle[i] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aColor', new BufferAttribute(colors, 3));
    g.setAttribute('aSize', new BufferAttribute(sizes, 1));
    g.setAttribute('aTwinkle', new BufferAttribute(twinkle, 1));
    return g;
  }, [count, seed]);
  const material = useMemo(() => createStarMaterial(), []);

  useSceneTime(speed, (time) => {
    material.uniforms.uTime.value = time;
  });

  return <points name="starfield" geometry={geometry} material={material} />;
}
