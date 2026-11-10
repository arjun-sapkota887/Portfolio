import { useThree } from '@react-three/fiber';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useEffect } from 'react';
import type { Camera } from 'three';
import { Vector3 } from 'three';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';
import { OVERVIEW } from '../lib/camera';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';

const captured: { camera?: Camera } = {};
const CaptureCamera = () => {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    captured.camera = camera;
  }, [camera]);
  return null;
};
const cam = () => captured.camera!;

const Scene = ({ active }: { active: SectionId | null }) => (
  <>
    <CaptureCamera />
    <SolarSystem sections={portfolio.sections} onSelect={() => {}} speed={0} />
    <CameraRig active={active} />
  </>
);

const planetPosition = (
  renderer: Awaited<ReturnType<typeof ReactThreeTestRenderer.create>>,
  id: string,
) => renderer.scene.findAll((n) => n.props.name === `planet-${id}`)[0].instance.position as Vector3;

describe('CameraRig', () => {
  it('flies the camera toward the focused planet', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Scene active={null} />);
    await renderer.advanceFrames(240, 1 / 60);
    const target = planetPosition(renderer, 'projects');
    const before = cam().position.distanceTo(target);

    await renderer.update(<Scene active="projects" />);
    await renderer.advanceFrames(240, 1 / 60);
    const after = cam().position.distanceTo(target);
    expect(after).toBeLessThan(before / 3);
  });

  it('returns to the overview when focus is cleared', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Scene active="experience" />);
    await renderer.advanceFrames(240, 1 / 60);
    await renderer.update(<Scene active={null} />);
    await renderer.advanceFrames(400, 1 / 60);
    expect(cam().position.distanceTo(new Vector3(...OVERVIEW.position))).toBeLessThan(0.5);
  });

  it('focuses the sun for the About section', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Scene active="about" />);
    await renderer.advanceFrames(400, 1 / 60);
    expect(cam().position.length()).toBeLessThan(20);
  });
});
