import { useEffect } from 'react';
import type { NavigationStore } from './navigation';

const readHash = () => decodeURIComponent(location.hash.slice(1));

/** Keeps `#section` in the URL in sync with the focused section (deep links, back/forward). */
export function useHashSync(store: NavigationStore): void {
  useEffect(() => {
    const applyHash = () => {
      const id = readHash();
      if (id) store.getState().focus(id);
      else store.getState().back();
    };
    if (readHash()) applyHash();

    const unsubscribe = store.subscribe(({ active }, previous) => {
      if (active === previous.active || readHash() === (active ?? '')) return;
      const url = active ? `#${active}` : location.pathname + location.search;
      history.pushState(null, '', url);
    });

    window.addEventListener('hashchange', applyHash);
    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', applyHash);
    };
  }, [store]);
}
