import { Canvas } from '@react-three/fiber';
import { portfolio } from '../data/portfolio';
import { flags } from '../lib/flags';
import { navigationStore, useNavigation } from '../state/navigation';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';

const { focus, hover } = navigationStore.getState();

export default function SceneRoot() {
  const active = useNavigation((s) => s.active);
  const speed = flags.static || active ? 0 : 1;

  return (
    <div className="scene" data-testid="scene">
      <Canvas
        camera={{ position: [0, 16, 40], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: flags.static }}
        onPointerMissed={() => hover(null)}
      >
        <color attach="background" args={['#020208']} />
        <SolarSystem sections={portfolio.sections} onSelect={focus} onHover={hover} speed={speed} />
        <CameraRig active={active} />
      </Canvas>
    </div>
  );
}
