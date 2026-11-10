import { useEffect } from 'react';
import type { NavigationStore } from './navigation';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Escape → overview, ArrowLeft/ArrowRight → previous/next section. */
export function useKeyboardNav(store: NavigationStore): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return;
      const { back, next, prev } = store.getState();
      if (event.key === 'Escape') back();
      else if (event.key === 'ArrowRight') next();
      else if (event.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [store]);
}
