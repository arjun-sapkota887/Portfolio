import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

/** Accumulated scene time scaled by `speed`; speed 0 freezes everything (static mode, focus). */
export function useSceneTime(speed: number, onTick?: (time: number) => void) {
  const time = useRef(0);
  useFrame((_, delta) => {
    time.current += delta * speed;
    onTick?.(time.current);
  });
  return time;
}
