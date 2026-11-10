import { lazy, Suspense } from 'react';
import { portfolio } from './data/portfolio';
import { HoverLabel } from './ui/HoverLabel';

const SceneRoot = lazy(() => import('./scene/SceneRoot'));

export default function App() {
  return (
    <main className="app">
      <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
        <SceneRoot />
      </Suspense>
      <header className="title">
        <h1>{portfolio.owner.name}</h1>
        <p>{portfolio.owner.role}</p>
      </header>
      <HoverLabel />
    </main>
  );
}
