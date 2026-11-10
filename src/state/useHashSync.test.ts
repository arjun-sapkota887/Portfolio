import { act, renderHook } from '@testing-library/react';
import { createNavigationStore } from './navigation';
import { useHashSync } from './useHashSync';

const setup = () => createNavigationStore(['about', 'skills', 'projects']);

beforeEach(() => history.replaceState(null, '', '/'));

describe('useHashSync', () => {
  it('focuses the section named in the initial hash', () => {
    history.replaceState(null, '', '/#projects');
    const store = setup();
    renderHook(() => useHashSync(store));
    expect(store.getState().active).toBe('projects');
  });

  it('skips the intro for deep links', () => {
    history.replaceState(null, '', '/#projects');
    const store = setup();
    renderHook(() => useHashSync(store));
    expect(store.getState().introDone).toBe(true);
  });

  it('ignores an unknown initial hash', () => {
    history.replaceState(null, '', '/#nope');
    const store = setup();
    renderHook(() => useHashSync(store));
    expect(store.getState().active).toBeNull();
  });

  it('writes the focused section to the hash and clears it on back', () => {
    const store = setup();
    renderHook(() => useHashSync(store));
    act(() => store.getState().focus('skills'));
    expect(location.hash).toBe('#skills');
    act(() => store.getState().back());
    expect(location.hash).toBe('');
    expect(location.pathname).toBe('/');
  });

  it('follows hash changes from the browser (back/forward, links)', () => {
    const store = setup();
    renderHook(() => useHashSync(store));
    act(() => {
      history.replaceState(null, '', '/#about');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(store.getState().active).toBe('about');
    act(() => {
      history.replaceState(null, '', '/');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(store.getState().active).toBeNull();
  });

  it('stops syncing after unmount', () => {
    const store = setup();
    const { unmount } = renderHook(() => useHashSync(store));
    unmount();
    store.getState().focus('skills');
    expect(location.hash).toBe('');
  });
});
