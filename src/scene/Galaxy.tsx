import { useMemo, useRef } from 'react';
import { Billboard } from '@react-three/drei';
import { BufferAttribute, BufferGeometry, type Group } from 'three';
import { galaxyPoints } from '../lib/galaxy';
import { createGlowMaterial, createStarMaterial } from './shaders/materials';
import { useSceneTime } from './useSceneTime';

export function Galaxy({ speed, visible }: { speed: number; visible: boolean }) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => {
    const { positions, colors, sizes } = galaxyPoints({
      count: 24000,
      radius: 30,
      arms: 4,
      seed: 11,
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aColor', new BufferAttribute(colors, 3));
    g.setAttribute('aSize', new BufferAttribute(sizes, 1));
    g.setAttribute('aTwinkle', new BufferAttribute(new Float32Array(sizes.length), 1));
    return g;
  }, []);
  const material = useMemo(() => createStarMaterial(), []);
  const glow = useMemo(() => createGlowMaterial('#ffd9a0', 0.9), []);

  useSceneTime(speed, (time) => {
    if (group.current) group.current.rotation.y = -time * 0.04;
  });

  return (
    <group name="galaxy" ref={group} visible={visible} rotation={[0.25, 0, 0.1]}>
      <points geometry={geometry} material={material} />
      <Billboard>
        <mesh material={glow}>
          <planeGeometry args={[22, 22]} />
        </mesh>
      </Billboard>
    </group>
  );
}
