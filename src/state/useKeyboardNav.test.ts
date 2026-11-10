import { act, renderHook } from '@testing-library/react';
import { createNavigationStore } from './navigation';
import { useKeyboardNav } from './useKeyboardNav';

const setup = () => {
  const store = createNavigationStore(['about', 'skills', 'projects']);
  const hook = renderHook(() => useKeyboardNav(store));
  return { store, ...hook };
};

const press = (key: string, target: EventTarget = window) =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });

describe('useKeyboardNav', () => {
  it('Escape returns to the overview', () => {
    const { store } = setup();
    store.getState().focus('skills');
    press('Escape');
    expect(store.getState().active).toBeNull();
  });

  it('ArrowRight and ArrowLeft cycle through sections', () => {
    const { store } = setup();
    press('ArrowRight');
    expect(store.getState().active).toBe('about');
    press('ArrowRight');
    expect(store.getState().active).toBe('skills');
    press('ArrowLeft');
    expect(store.getState().active).toBe('about');
  });

  it('ignores keys typed into form fields', () => {
    const { store } = setup();
    const input = document.createElement('input');
    document.body.append(input);
    press('ArrowRight', input);
    expect(store.getState().active).toBeNull();
    input.remove();
  });

  it('removes its listener on unmount', () => {
    const { store, unmount } = setup();
    unmount();
    press('ArrowRight');
    expect(store.getState().active).toBeNull();
  });
});
