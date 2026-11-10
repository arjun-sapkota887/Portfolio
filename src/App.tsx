import { lazy, Suspense, useState } from 'react';
import { portfolio } from './data/portfolio';
import { flags } from './lib/flags';
import { isWebGLAvailable } from './lib/webgl';
import { navigationStore, useNavigation } from './state/navigation';
import { useHashSync } from './state/useHashSync';
import { useKeyboardNav } from './state/useKeyboardNav';
import { Fallback } from './ui/Fallback';
import { HoverLabel } from './ui/HoverLabel';
import { Intro } from './ui/Intro';
import { Loader } from './ui/Loader';
import { NavMenu } from './ui/NavMenu';
import { SectionPanel } from './ui/SectionPanel';

const SceneRoot = lazy(() => import('./scene/SceneRoot'));

function SolarApp() {
  useHashSync(navigationStore);
  useKeyboardNav(navigationStore);
  const introDone = useNavigation((s) => s.introDone);

  return (
    <main className="app">
      <Suspense fallback={<Loader />}>
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

export default function App() {
  const [webgl] = useState(() => isWebGLAvailable());
  return webgl ? <SolarApp /> : <Fallback />;
}
