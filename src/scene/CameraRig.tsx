import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';
import { focusPose, OVERVIEW, viewOffsetFor, type CameraPose } from '../lib/camera';
import { damp } from '../lib/easing';

const SMOOTHING = 2.5;
const sizes = new Map(portfolio.sections.map((s) => [s.id, s.body]));
const scratch = new Vector3();

/** Smoothly flies the camera between the overview and the focused body each frame. */
export function CameraRig({
  active,
}: {
  active: SectionId | null;
  stage?: 'intro' | 'diving' | 'scene';
}) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const size = useThree((state) => state.size);
  const lookAt = useRef(new Vector3(...OVERVIEW.lookAt));
  const offset = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const pose = poseFor(active);
    const p = camera.position;
    p.set(
      damp(p.x, pose.position[0], SMOOTHING, dt),
      damp(p.y, pose.position[1], SMOOTHING, dt),
      damp(p.z, pose.position[2], SMOOTHING, dt),
    );
    const l = lookAt.current;
    l.set(
      damp(l.x, pose.lookAt[0], SMOOTHING, dt),
      damp(l.y, pose.lookAt[1], SMOOTHING, dt),
      damp(l.z, pose.lookAt[2], SMOOTHING, dt),
    );
    camera.lookAt(l);

    if (camera instanceof PerspectiveCamera) {
      const target = viewOffsetFor(active !== null, size.width, size.height);
      const o = offset.current;
      o.x = damp(o.x, target.x, SMOOTHING, dt);
      o.y = damp(o.y, target.y, SMOOTHING, dt);
      if (Math.abs(o.x) + Math.abs(o.y) < 0.5) camera.clearViewOffset();
      else camera.setViewOffset(size.width, size.height, o.x, o.y, size.width, size.height);
    }
  });

  function poseFor(id: SectionId | null): CameraPose {
    const body = id ? sizes.get(id) : undefined;
    if (!id || !body) return OVERVIEW;
    const object = scene.getObjectByName(body.kind === 'sun' ? 'sun' : `planet-${id}`);
    if (!object) return OVERVIEW;
    object.getWorldPosition(scratch);
    return focusPose([scratch.x, scratch.y, scratch.z], body.size);
  }

  return null;
}
