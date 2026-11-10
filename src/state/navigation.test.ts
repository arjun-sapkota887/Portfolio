import type { SectionId } from '../data/types';
import { createNavigationStore } from './navigation';

const order: SectionId[] = ['about', 'skills', 'projects'];
const setup = () => createNavigationStore(order);

describe('navigation store', () => {
  it('starts on the overview with the intro pending', () => {
    const store = setup();
    expect(store.getState()).toMatchObject({ active: null, introDone: false, order });
  });

  it('focuses a known section', () => {
    const store = setup();
    store.getState().focus('projects');
    expect(store.getState().active).toBe('projects');
  });

  it('ignores unknown section ids', () => {
    const store = setup();
    store.getState().focus('skills');
    store.getState().focus('blog');
    expect(store.getState().active).toBe('skills');
  });

  it('back returns to the overview', () => {
    const store = setup();
    store.getState().focus('skills');
    store.getState().back();
    expect(store.getState().active).toBeNull();
  });

  it('next starts at the first section and wraps around', () => {
    const store = setup();
    const { next } = store.getState();
    next();
    expect(store.getState().active).toBe('about');
    next();
    next();
    expect(store.getState().active).toBe('projects');
    next();
    expect(store.getState().active).toBe('about');
  });

  it('prev starts at the last section and wraps around', () => {
    const store = setup();
    const { prev } = store.getState();
    prev();
    expect(store.getState().active).toBe('projects');
    store.getState().focus('about');
    prev();
    expect(store.getState().active).toBe('projects');
  });

  it('finishIntro marks the intro as done', () => {
    const store = setup();
    store.getState().finishIntro();
    expect(store.getState().introDone).toBe(true);
  });
});
