import { AdaptiveDpr } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { portfolio } from '../data/portfolio';
import { flags } from '../lib/flags';
import { navigationStore, useNavigation } from '../state/navigation';
import { CameraRig } from './CameraRig';
import { Galaxy } from './Galaxy';
import { SolarSystem } from './SolarSystem';

const { focus, hover } = navigationStore.getState();

export default function SceneRoot() {
  const active = useNavigation((s) => s.active);
  const introDone = useNavigation((s) => s.introDone);
  const diving = useNavigation((s) => s.diving);
  const stage = introDone ? 'scene' : diving ? 'diving' : 'intro';
  const speed = flags.static || active ? 0 : 1;

  return (
    <div className="scene" data-testid="scene">
      <Canvas
        camera={{ position: [0, 48, 26], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, preserveDrawingBuffer: flags.static }}
        onPointerMissed={() => hover(null)}
      >
        <color attach="background" args={['#020208']} />
        <AdaptiveDpr pixelated />
        <Galaxy speed={flags.static ? 0 : 1} visible={!introDone} />
        <group visible={introDone}>
          <SolarSystem
            sections={portfolio.sections}
            onSelect={focus}
            onHover={hover}
            speed={speed}
          />
        </group>
        <CameraRig active={active} stage={stage} />
      </Canvas>
    </div>
  );
}
