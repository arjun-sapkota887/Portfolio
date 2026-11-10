import { createStore } from 'zustand/vanilla';
import type { SectionId } from '../data/types';

export interface NavigationState {
  order: SectionId[];
  /** Focused section, or null for the solar-system overview. */
  active: SectionId | null;
  introDone: boolean;
  focus: (id: string) => void;
  back: () => void;
  next: () => void;
  prev: () => void;
  finishIntro: () => void;
}

export type NavigationStore = ReturnType<typeof createNavigationStore>;

export function createNavigationStore(_order: SectionId[]) {
  return createStore<NavigationState>()(() => {
    throw new Error('not implemented');
  });
}
