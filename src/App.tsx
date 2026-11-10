import { lazy, Suspense } from 'react';
import { portfolio } from './data/portfolio';
import { flags } from './lib/flags';
import { navigationStore, useNavigation } from './state/navigation';
import { useHashSync } from './state/useHashSync';
import { useKeyboardNav } from './state/useKeyboardNav';
import { HoverLabel } from './ui/HoverLabel';
import { Intro } from './ui/Intro';
import { NavMenu } from './ui/NavMenu';
import { SectionPanel } from './ui/SectionPanel';

const SceneRoot = lazy(() => import('./scene/SceneRoot'));

export default function App() {
  useHashSync(navigationStore);
  useKeyboardNav(navigationStore);
  const introDone = useNavigation((s) => s.introDone);

  return (
    <main className="app">
      <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
        <SceneRoot />
      </Suspense>
      <Intro instant={flags.static} />
      {introDone && (
        <>
          <header className="title">
            <h1>{portfolio.owner.name}</h1>
            <p>{portfolio.owner.role}</p>
          </header>
          <NavMenu />
          <HoverLabel />
          <SectionPanel />
        </>
      )}
    </main>
  );
}
