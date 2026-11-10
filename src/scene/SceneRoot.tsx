import { Canvas } from '@react-three/fiber';
import { portfolio } from '../data/portfolio';
import { flags } from '../lib/flags';
import { navigationStore } from '../state/navigation';
import { SolarSystem } from './SolarSystem';

export default function SceneRoot() {
  return (
    <div className="scene" data-testid="scene">
      <Canvas
        camera={{ position: [0, 16, 40], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: flags.static }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={['#020208']} />
        <SolarSystem
          sections={portfolio.sections}
          onSelect={(id) => navigationStore.getState().focus(id)}
          speed={flags.static ? 0 : 1}
        />
      </Canvas>
    </div>
  );
}
