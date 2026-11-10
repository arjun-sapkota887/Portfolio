import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { portfolio } from '../data/portfolio';
import type { SectionId } from '../data/types';

export interface NavigationState {
  order: SectionId[];
  /** Focused section, or null for the solar-system overview. */
  active: SectionId | null;
  introDone: boolean;
  /** Camera is diving from the galaxy into the solar system. */
  diving: boolean;
  /** Section under the pointer, for hover labels. */
  hovered: SectionId | null;
  focus: (id: string) => void;
  back: () => void;
  next: () => void;
  prev: () => void;
  enter: () => void;
  finishIntro: () => void;
  hover: (id: string | null) => void;
}

export type NavigationStore = ReturnType<typeof createNavigationStore>;

export function createNavigationStore(order: SectionId[]) {
  const step = (active: SectionId | null, delta: 1 | -1): SectionId => {
    if (active === null) return delta === 1 ? order[0] : order[order.length - 1];
    const index = order.indexOf(active);
    return order[(index + delta + order.length) % order.length];
  };

  const isSection = (id: string | null): id is SectionId =>
    (order as (string | null)[]).includes(id);

  return createStore<NavigationState>()((set) => ({
    order,
    active: null,
    introDone: false,
    diving: false,
    enter: () => {},
    hovered: null,
    focus: (id) => {
      if (isSection(id)) set({ active: id });
    },
    back: () => set({ active: null }),
    next: () => set(({ active }) => ({ active: step(active, 1) })),
    prev: () => set(({ active }) => ({ active: step(active, -1) })),
    finishIntro: () => set({ introDone: true }),
    hover: (id) => set({ hovered: isSection(id) ? id : null }),
  }));
}

export const navigationStore = createNavigationStore(portfolio.sections.map((s) => s.id));

export function useNavigation<T>(selector: (state: NavigationState) => T): T {
  return useStore(navigationStore, selector);
}
