import { lazy, Suspense } from 'react';
import { portfolio } from './data/portfolio';
import { navigationStore } from './state/navigation';
import { useHashSync } from './state/useHashSync';
import { useKeyboardNav } from './state/useKeyboardNav';
import { HoverLabel } from './ui/HoverLabel';
import { NavMenu } from './ui/NavMenu';
import { SectionPanel } from './ui/SectionPanel';

const SceneRoot = lazy(() => import('./scene/SceneRoot'));

export default function App() {
  useHashSync(navigationStore);
  useKeyboardNav(navigationStore);

  return (
    <main className="app">
      <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
        <SceneRoot />
      </Suspense>
      <header className="title">
        <h1>{portfolio.owner.name}</h1>
        <p>{portfolio.owner.role}</p>
      </header>
      <NavMenu />
      <HoverLabel />
      <SectionPanel />
    </main>
  );
}
