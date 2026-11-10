import { Billboard } from '@react-three/drei';
import { useMemo } from 'react';
import { createGlowMaterial, createSunMaterial } from './shaders/materials';
import { useSceneTime } from './useSceneTime';

interface SunProps {
  size: number;
  speed: number;
  onSelect: () => void;
}

export function Sun({ size, speed, onSelect }: SunProps) {
  const surface = useMemo(() => createSunMaterial(), []);
  const glow = useMemo(() => createGlowMaterial('#ffae42', 1.1), []);
  const corona = useMemo(() => createGlowMaterial('#ff6a1a', 0.6), []);

  useSceneTime(speed, (time) => {
    surface.uniforms.uTime.value = time;
  });

  return (
    <group>
      <mesh
        name="sun"
        material={surface}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <sphereGeometry args={[size, 96, 96]} />
      </mesh>
      <Billboard>
        <mesh material={glow} renderOrder={1}>
          <planeGeometry args={[size * 5, size * 5]} />
        </mesh>
        <mesh material={corona} renderOrder={1}>
          <planeGeometry args={[size * 16, size * 16]} />
        </mesh>
      </Billboard>
      <pointLight intensity={2} distance={0} decay={0} color="#fff1d6" />
    </group>
  );
}
