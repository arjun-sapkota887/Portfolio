import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { Object3D } from 'three';
import { portfolio } from '../data/portfolio';
import { SolarSystem } from './SolarSystem';

const sections = portfolio.sections;
const planetIds = sections.filter((s) => s.body.kind === 'planet').map((s) => s.id);

const renderScene = (props: Partial<Parameters<typeof SolarSystem>[0]> = {}) =>
  ReactThreeTestRenderer.create(
    <SolarSystem sections={sections} onSelect={() => {}} speed={1} {...props} />,
  );

type Renderer = Awaited<ReturnType<typeof renderScene>>;

const findNamed = (renderer: Renderer, name: string) =>
  renderer.scene.findAll((node) => node.props.name === name);

const objectNamed = (renderer: Renderer, name: string): Object3D => {
  const [node] = findNamed(renderer, name);
  if (!node) throw new Error(`No object named ${name}`);
  return node.instance as Object3D;
};

describe('SolarSystem', () => {
  it('renders the sun', async () => {
    const renderer = await renderScene();
    expect(findNamed(renderer, 'sun')).toHaveLength(1);
  });

  it('renders one named planet per planet section', async () => {
    const renderer = await renderScene();
    for (const id of planetIds) expect(findNamed(renderer, `planet-${id}`)).toHaveLength(1);
  });

  it('renders one orbit line per planet', async () => {
    const renderer = await renderScene();
    const orbits = renderer.scene.findAll((n) => String(n.props.name ?? '').startsWith('orbit-'));
    expect(orbits).toHaveLength(planetIds.length);
  });

  it('gives only the ringed planet a ring', async () => {
    const renderer = await renderScene();
    const rings = renderer.scene.findAll((n) => String(n.props.name ?? '').startsWith('ring-'));
    expect(rings.map((r) => r.props.name)).toEqual(['ring-contact']);
  });

  it('renders a starfield and the milky way backdrop', async () => {
    const renderer = await renderScene();
    expect(findNamed(renderer, 'starfield')).toHaveLength(1);
    expect(findNamed(renderer, 'milky-way')).toHaveLength(1);
  });

  it('selects a planet section when its planet is clicked', async () => {
    const onSelect = vi.fn();
    const renderer = await renderScene({ onSelect });
    await renderer.fireEvent(findNamed(renderer, 'planet-mesh-projects')[0], 'click');
    expect(onSelect).toHaveBeenCalledWith('projects');
  });

  it('selects About when the sun is clicked', async () => {
    const onSelect = vi.fn();
    const renderer = await renderScene({ onSelect });
    await renderer.fireEvent(findNamed(renderer, 'sun')[0], 'click');
    expect(onSelect).toHaveBeenCalledWith('about');
  });

  it('moves planets along their orbits over time', async () => {
    const renderer = await renderScene({ speed: 1 });
    const planet = objectNamed(renderer, 'planet-skills');
    await renderer.advanceFrames(1, 0);
    const before = planet.position.clone();
    await renderer.advanceFrames(30, 0.1);
    expect(planet.position.distanceTo(before)).toBeGreaterThan(0.1);
  });

  it('keeps planets still when speed is 0', async () => {
    const renderer = await renderScene({ speed: 0 });
    const planet = objectNamed(renderer, 'planet-skills');
    await renderer.advanceFrames(1, 0);
    const before = planet.position.clone();
    await renderer.advanceFrames(30, 0.1);
    expect(planet.position.distanceTo(before)).toBe(0);
  });

  it('starts every planet away from the sun at its orbit distance', async () => {
    const renderer = await renderScene({ speed: 0 });
    await renderer.advanceFrames(1, 0);
    for (const section of sections) {
      if (section.body.kind !== 'planet') continue;
      const { radius, eccentricity } = section.body.orbit;
      const distance = objectNamed(renderer, `planet-${section.id}`).position.length();
      expect(distance).toBeGreaterThanOrEqual(radius * (1 - eccentricity) - 1e-6);
      expect(distance).toBeLessThanOrEqual(radius * (1 + eccentricity) + 1e-6);
    }
  });

  it('reports hover over and out of a planet', async () => {
    const onHover = vi.fn();
    const renderer = await renderScene({ onHover });
    const mesh = findNamed(renderer, 'planet-mesh-skills')[0];
    await renderer.fireEvent(mesh, 'pointerOver');
    expect(onHover).toHaveBeenLastCalledWith('skills');
    await renderer.fireEvent(mesh, 'pointerOut');
    expect(onHover).toHaveBeenLastCalledWith(null);
  });

  it('reports hover over the sun as About', async () => {
    const onHover = vi.fn();
    const renderer = await renderScene({ onHover });
    await renderer.fireEvent(findNamed(renderer, 'sun')[0], 'pointerOver');
    expect(onHover).toHaveBeenLastCalledWith('about');
  });
});
